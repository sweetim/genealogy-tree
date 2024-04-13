module genealogy_tree::contract {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::object::{ExtendRef, TransferRef};
    use aptos_framework::timestamp;
    #[test_only]
    use std::string;


    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::event::emitted_events;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct GenealogyTree has key {
        directory: SmartTable<u256, Person>,
        index: u256,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Person has key, store, copy, drop {
        id: u256,
        childrens: vector<u256>,
        parents: vector<u256>,
        metadata: PersonMetadata
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct PersonMetadata has key, store, copy, drop {
        name: String,
        age: u8,
        date_of_birth: String,
        gender: u8,
        date_of_death: String,
        image_uri: String,
        location: String,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct GenealogyTreeManager has key {
        extend_ref: ExtendRef,
        transfer_ref: TransferRef
    }

    #[event]
    struct PersonRegisteredEvent has key, store, drop, copy {
        owner: address,
        person: Person,
        timestamp_us: u64,
    }

    const PERSON_GENDER_MALE: u8 = 1;
    const PERSON_GENDER_FEMALE: u8 = 2;

    const PERSON_DIRECTORY_COLLECTION: vector<u8> = b"GENEALOGY_TREE_PERSON_DIRECTORY";

    const E_PERSON_NOT_REGISTRED: u64 = 1;

    fun init_module(owner: &signer) {
        let constructor_ref = &object::create_named_object(owner, PERSON_DIRECTORY_COLLECTION);
        let extend_ref = object::generate_extend_ref(constructor_ref);
        let transfer_ref = object::generate_transfer_ref(constructor_ref);
        let object_signer = &object::generate_signer(constructor_ref);

        move_to(object_signer, GenealogyTreeManager {
            extend_ref,
            transfer_ref
        });

        move_to(object_signer, GenealogyTree {
            index: 0,
            directory: smart_table::new(),
        });
    }

    public entry fun register_person(user: &signer,
                                     name: String,
                                     location: String,
                                     image_uri: String,
                                     gender: u8,
                                     date_of_birth: String,
                                     date_of_death: String,
                                     age: u8
    ) acquires GenealogyTree {
        let genealogy_tree = borrow_global_mut<GenealogyTree>(get_genealogy_tree_address());
        let person = Person {
            id: genealogy_tree.index,
            parents: vector[],
            childrens: vector[],
            metadata: PersonMetadata {
                name,
                location,
                image_uri,
                gender,
                date_of_birth,
                date_of_death,
                age
            }
        };

        smart_table::upsert(&mut genealogy_tree.directory, genealogy_tree.index, person);
        genealogy_tree.index = genealogy_tree.index + 1;

        event::emit(PersonRegisteredEvent {
            person,
            owner: signer::address_of(user),
            timestamp_us: timestamp::now_microseconds()
        });
    }

    #[view]
    public fun get_person_by_index(index: u256): Person acquires GenealogyTree {
        let genealogy_tree = borrow_global<GenealogyTree>(get_genealogy_tree_address());
        *smart_table::borrow(&genealogy_tree.directory, index)
    }

    public entry fun update_person_relation(
        _user: &signer,
        person_indexs: vector<u256>,
        parents: vector<vector<u256>>,
        childrens: vector<vector<u256>>,
    ) acquires GenealogyTree {
        let genealogy_tree_address = get_genealogy_tree_address();
        let genealogy_tree = borrow_global_mut<GenealogyTree>(genealogy_tree_address);

        vector::enumerate_ref(&person_indexs, |i, index| {
            let index_parents = vector::borrow(&parents, i);
            let index_childrens = vector::borrow(&childrens, i);

            let person = smart_table::borrow_mut(&mut genealogy_tree.directory, *index);
            person.childrens = *index_childrens;
            person.parents = *index_parents;
        });
    }

    #[view]
    public fun get_genealogy_tree(): vector<Person> acquires GenealogyTree {
        let genealogy_tree_address = get_genealogy_tree_address();
        let genealogy_tree = borrow_global_mut<GenealogyTree>(genealogy_tree_address);

        let output = vector[];
        let index = 0;

        while (index < genealogy_tree.index) {
            let person = smart_table::borrow(&genealogy_tree.directory, index);
            vector::push_back(&mut output, *person);
            index = index + 1;
        };

        output
    }

    #[view]
    public fun get_genealogy_tree_address(): address {
        object::create_object_address(&@genealogy_tree, PERSON_DIRECTORY_COLLECTION)
    }

    #[test(framework = @0x1, user_1 = @0x123)]
    public fun test_register_person(framework: &signer, user_1: &signer) acquires GenealogyTree {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);
        account::create_account_for_test(signer::address_of(user_1));

        let name = string::utf8(b"name");
        let location = string::utf8(b"location");
        let image_uri = string::utf8(b"image_uri");
        let gender = PERSON_GENDER_FEMALE;
        let date_of_birth = string::utf8(b"2020-01-10");
        let date_of_death = string::utf8(b"");
        let age = 1;

        init_module(owner);
        register_person(user_1, name, location, image_uri, gender, date_of_birth, date_of_death, age);

        let event_length = vector::length(&emitted_events<PersonRegisteredEvent>());
        assert!(event_length == 1, 1);
    }

    #[test(framework = @0x1, user_1 = @0x123)]
    public fun test_get_genealogy_tree(framework: &signer, user_1: &signer) acquires GenealogyTree {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);
        account::create_account_for_test(signer::address_of(user_1));

        init_module(owner);
        register_person(user_1,
            string::utf8(b"person 1"),
            string::utf8(b"location 1"),
            string::utf8(b"image_uri 1"),
            PERSON_GENDER_FEMALE,
            string::utf8(b"2020-01-10"),
            string::utf8(b""),
            2);

        register_person(user_1,
            string::utf8(b"person 2"),
            string::utf8(b"location 2"),
            string::utf8(b"image_uri 2"),
            PERSON_GENDER_MALE,
            string::utf8(b"2000-01-10"),
            string::utf8(b"2022-01-10"),
            22);

        update_person_relation(
            user_1,
            vector[1],
            vector[vector[]],
            vector[vector[0]]);

        let actual = get_genealogy_tree();
        let expected = vector [
            Person {
                id: 0,
                childrens: vector[],
                parents: vector[],
                metadata: PersonMetadata {
                    name: string::utf8(b"person 1"),
                    age: 2,
                    gender: 2,
                    date_of_birth: string::utf8(b"2020-01-10"),
                    date_of_death: string::utf8(b""),
                    image_uri: string::utf8(b"image_uri 1"),
                    location: string::utf8(b"location 1")
                }
            },
            Person {
                id: 1,
                childrens: vector[ 0 ],
                parents: vector[],
                metadata: PersonMetadata {
                    name: string::utf8(b"person 2"),
                    age: 22,
                    gender: 1,
                    date_of_birth: string::utf8(b"2000-01-10"),
                    date_of_death: string::utf8(b"2022-01-10"),
                    image_uri: string::utf8(b"image_uri 2"),
                    location: string::utf8(b"location 2"),
                }
            }
        ];

        assert!(actual == expected, 1);
        assert!(vector::length(&actual) == 2, 1);
    }
}