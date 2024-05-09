module genealogy_tree::contract {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    #[test_only]
    use std::string;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::event::emitted_events;
    #[test_only]
    use genealogy_tree::nft::init_module_for_testing;

    struct PersonMetadata has key, store, drop, copy {
        index: u64,
        id: String,
        name: String,
        gender: u8,
        date_of_birth: String,
        date_of_death: String,
        image_uri: String,
    }

    struct PersonRelationShip has key, store, drop, copy {
        parent_ids: vector<String>,
        children_ids: vector<String>,
    }

    struct Person has key, store, drop, copy {
        metadata: PersonMetadata,
        relationship: PersonRelationShip
    }

    struct GenealogyTreeMetadata has key, store, drop, copy {
        name: String,
        uri: String,
        description: String,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct GenealogyTree has key, store {
        metadata: GenealogyTreeMetadata,
        person: SmartTable<String, Person>
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct GenealogyTreeCollection has key, store {
        tree: vector<GenealogyTree>,
        name_service: SmartTable<String, u64>,
    }

    #[event]
    struct GenealogyTreeCollectionCreatedEvent has store, drop {
        user: address,
        name: String,
        timestamp_us: u64,
    }

    #[event]
    struct PersonMetadataPopulatedEvent has store, drop {
        user: address,
        id: String,
        timestamp_us: u64,
    }

    const PERSON_GENDER_MALE: u8 = 1;
    const PERSON_GENDER_FEMALE: u8 = 2;

    fun init_module(owner: &signer) {
        move_to(owner, GenealogyTreeCollection {
            tree: vector::empty<GenealogyTree>(),
            name_service: smart_table::new<String, u64>()
        });
    }

    public entry fun create_genealogy_tree_collection(
        user: &signer,
        name: String,
        description: String,
        uri: String) acquires GenealogyTreeCollection
    {
        let gt_collection = borrow_global_mut<GenealogyTreeCollection>(@genealogy_tree);

        let current_tree_index = vector::length(&gt_collection.tree);
        vector::push_back(&mut gt_collection.tree, GenealogyTree {
            metadata: GenealogyTreeMetadata {
                name,
                description,
                uri,
            },
            person: smart_table::new<String, Person>(),
        });

        smart_table::upsert(&mut gt_collection.name_service, name, current_tree_index);

        genealogy_tree::nft::create_collection(
            user,
            name,
            description,
            uri
        );

        event::emit(GenealogyTreeCollectionCreatedEvent {
            name,
            timestamp_us: timestamp::now_microseconds(),
            user: signer::address_of(user),
        });
    }

    #[view]
    public fun get_collection_index_from(name: String): u64 acquires GenealogyTreeCollection {
        let gt_collection = borrow_global<GenealogyTreeCollection>(@genealogy_tree);
        *smart_table::borrow(&gt_collection.name_service, name)
    }

    public entry fun populate_person_metadata(
        user: &signer,
        collection_name: String,
        id: String,
        name: String,
        gender: u8,
        date_of_birth: String,
        date_of_death: String,
        image_uri: String,
        parent_ids: vector<String>,
        children_ids: vector<String>) acquires GenealogyTreeCollection
    {
        let collection_index = get_collection_index_from(collection_name);

        let gt_collection = borrow_global_mut<GenealogyTreeCollection>(@genealogy_tree);
        let gt = vector::borrow_mut(&mut gt_collection.tree, collection_index);
        let current_person_count = smart_table::length(&gt.person);

        smart_table::upsert(
            &mut gt.person,
            id,
            Person {
                metadata: PersonMetadata {
                    index: current_person_count + 1,
                    id,
                    name,
                    gender,
                    date_of_birth,
                    date_of_death,
                    image_uri,
                },
                relationship: PersonRelationShip {
                    parent_ids,
                    children_ids,
                }
            });

        event::emit(PersonMetadataPopulatedEvent {
            id,
            user: signer::address_of(user),
            timestamp_us: timestamp::now_microseconds()
        })
    }

    #[view]
    public fun get_person_by_id(collection_name: String, id: String): Person acquires GenealogyTreeCollection {
        let collection_index = get_collection_index_from(collection_name);
        let gt_collection = borrow_global<GenealogyTreeCollection>(@genealogy_tree);
        let gt = vector::borrow(&gt_collection.tree, collection_index);

        *smart_table::borrow(&gt.person, id)
    }

    public entry fun mint_person(user: &signer, collection_name: String, id: String) acquires GenealogyTreeCollection {
        let collection_index = get_collection_index_from(collection_name);
        let gt_collection = borrow_global<GenealogyTreeCollection>(@genealogy_tree);
        let gt = vector::borrow(&gt_collection.tree, collection_index);

        let person = smart_table::borrow(&gt.person, id);

        let children_names = vector::map<String, String>(person.relationship.children_ids, |child_id| {
            smart_table::borrow(&gt.person, child_id).metadata.name
        });

        let parents_names = vector::map<String, String>(person.relationship.parent_ids, |parent_id| {
            smart_table::borrow(&gt.person, parent_id).metadata.name
        });

        genealogy_tree::nft::mint(
            collection_name,
            signer::address_of(user),
            id,
            person.metadata.index,
            person.metadata.name,
            person.metadata.gender,
            person.metadata.date_of_birth,
            person.metadata.date_of_death,
            person.metadata.image_uri,
            parents_names,
            children_names
        );
    }

    #[test(framework = @0x1, user_1 = @0x123)]
    public fun test_create_genealogy_tree_collection(framework: &signer, user_1: &signer) acquires GenealogyTreeCollection {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);

        account::create_account_for_test(signer::address_of(user_1));

        init_module(owner);
        init_module_for_testing(owner);

        create_genealogy_tree_collection(
            user_1,
            string::utf8(b"collection_name"),
            string::utf8(b"description"),
            string::utf8(b"uri")
        );

        let gt_collection = borrow_global<GenealogyTreeCollection>(@genealogy_tree);

        assert!(vector::length(&gt_collection.tree) == 1, 1);
        assert!(smart_table::length(&gt_collection.name_service) == 1, 2);

        let event_length = vector::length(&emitted_events<GenealogyTreeCollectionCreatedEvent>());
        assert!(event_length == 1, 3);
    }

    #[test(framework = @0x1, user_1 = @0x123, user_2 = @321)]
    public fun test_get_all_genealogy_tree_metadata(framework: &signer, user_1: &signer, user_2: &signer) acquires GenealogyTreeCollection {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);

        account::create_account_for_test(signer::address_of(user_1));

        init_module(owner);
        init_module_for_testing(owner);

        create_genealogy_tree_collection(
            user_1,
            string::utf8(b"collection_name 1"),
            string::utf8(b"description 1"),
            string::utf8(b"uri 1")
        );
        create_genealogy_tree_collection(
            user_2,
            string::utf8(b"collection_name 2"),
            string::utf8(b"description 2"),
            string::utf8(b"uri 2")
        );

        // let all_gt_metadata = get_all_genealogy_tree_metadata();

        // assert!(vector::length(&all_gt_metadata) == 2, 1);
    }

    #[test(framework = @0x1, user_1 = @0x123, user_2 = @321)]
    public fun test_get_collection_index_from(framework: &signer, user_1: &signer, user_2: &signer) acquires GenealogyTreeCollection {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);

        account::create_account_for_test(signer::address_of(user_1));

        let collection_name_1 = string::utf8(b"collection_name_1");
        let collection_name_2 = string::utf8(b"collection_name_2");
        let collection_name_3 = string::utf8(b"collection_name_3");

        init_module(owner);
        init_module_for_testing(owner);

        create_genealogy_tree_collection(
            user_1,
            collection_name_1,
            string::utf8(b"description"),
            string::utf8(b"uri")
        );
        create_genealogy_tree_collection(
            user_2,
            collection_name_3,
            string::utf8(b"description"),
            string::utf8(b"uri")
        );
        create_genealogy_tree_collection(
            user_1,
            collection_name_2,
            string::utf8(b"description"),
            string::utf8(b"uri")
        );

        assert!(get_collection_index_from(collection_name_1) == 0, 1);
        assert!(get_collection_index_from(collection_name_3) == 1, 1);
        assert!(get_collection_index_from(collection_name_2) == 2, 1);
    }

    #[test(framework = @0x1, user_1 = @0x123, user_2 = @321)]
    public fun test_populate_person_metadata(framework: &signer, user_1: &signer, user_2: &signer) acquires GenealogyTreeCollection {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);

        account::create_account_for_test(signer::address_of(user_1));

        let collection_name_1 = string::utf8(b"collection_name_1");

        init_module(owner);
        init_module_for_testing(owner);

        create_genealogy_tree_collection(
            user_1,
            collection_name_1,
            string::utf8(b"description"),
            string::utf8(b"uri")
        );

        populate_person_metadata(
            user_2,
            collection_name_1,
            string::utf8(b"id"),
            string::utf8(b"name"),
            PERSON_GENDER_FEMALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );

        let collection_index = get_collection_index_from(collection_name_1);
        let gt_collection = borrow_global<GenealogyTreeCollection>(@genealogy_tree);
        let gt = vector::borrow(&gt_collection.tree, collection_index);
        assert!(smart_table::length(&gt.person) == 1, 1);

        let event_length = vector::length(&emitted_events<PersonMetadataPopulatedEvent>());
        assert!(event_length == 1, 2);
    }

    #[test(framework = @0x1, user_1 = @0x123, user_2 = @321)]
    public fun test_populate_person_metadata_with_same_id_should_update_to_latest(
        framework: &signer, user_1: &signer, user_2: &signer) acquires GenealogyTreeCollection
    {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);

        account::create_account_for_test(signer::address_of(user_1));

        let collection_name_1 = string::utf8(b"collection_name_1");

        init_module(owner);
        init_module_for_testing(owner);

        create_genealogy_tree_collection(
            user_1,
            collection_name_1,
            string::utf8(b"description"),
            string::utf8(b"uri")
        );

        let person_id = string::utf8(b"person_id");

        populate_person_metadata(
            user_2,
            collection_name_1,
            person_id,
            string::utf8(b"name"),
            PERSON_GENDER_FEMALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );

        populate_person_metadata(
            user_1,
            collection_name_1,
            person_id,
            string::utf8(b"name_user_1"),
            PERSON_GENDER_MALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );

        populate_person_metadata(
            user_2,
            collection_name_1,
            person_id,
            string::utf8(b"name1"),
            PERSON_GENDER_MALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );

        let collection_index = get_collection_index_from(collection_name_1);
        let gt_collection = borrow_global<GenealogyTreeCollection>(@genealogy_tree);
        let gt = vector::borrow(&gt_collection.tree, collection_index);
        assert!(smart_table::length(&gt.person) == 1, 1);

        let event_length = vector::length(&emitted_events<PersonMetadataPopulatedEvent>());
        assert!(event_length == 3, 2);

        let person = get_person_by_id(collection_name_1, person_id);
        assert!(person.metadata.name == string::utf8(b"name1"), 3);
        assert!(person.metadata.gender == PERSON_GENDER_MALE, 4);
    }

    #[test(framework = @0x1, user_1 = @0x123, user_2 = @321)]
    public fun test_populate_multi_person_metadata(
        framework: &signer, user_1: &signer, user_2: &signer) acquires GenealogyTreeCollection
    {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);

        account::create_account_for_test(signer::address_of(user_1));

        let collection_name_1 = string::utf8(b"collection_name_1");
        let person_id_1 = string::utf8(b"person_id_1");
        let person_id_2 = string::utf8(b"person_id_2");
        let person_id_3 = string::utf8(b"person_id_3");

        init_module(owner);
        init_module_for_testing(owner);

        create_genealogy_tree_collection(
            user_1,
            collection_name_1,
            string::utf8(b"description"),
            string::utf8(b"uri")
        );

        populate_person_metadata(
            user_2,
            collection_name_1,
            person_id_1,
            string::utf8(b"name"),
            PERSON_GENDER_FEMALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );

        populate_person_metadata(
            user_1,
            collection_name_1,
            person_id_2,
            string::utf8(b"name_user_1"),
            PERSON_GENDER_MALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );

        populate_person_metadata(
            user_2,
            collection_name_1,
            person_id_3,
            string::utf8(b"name1"),
            PERSON_GENDER_MALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );

        let collection_index = get_collection_index_from(collection_name_1);
        let gt_collection = borrow_global<GenealogyTreeCollection>(@genealogy_tree);
        let gt = vector::borrow(&gt_collection.tree, collection_index);
        assert!(smart_table::length(&gt.person) == 3, 1);

        let event_length = vector::length(&emitted_events<PersonMetadataPopulatedEvent>());
        assert!(event_length == 3, 2);

        let person_1 = get_person_by_id(collection_name_1, person_id_1);
        let person_2 = get_person_by_id(collection_name_1, person_id_2);
        let person_3 = get_person_by_id(collection_name_1, person_id_3);

        assert!(person_1.metadata.index == 1, 3);
        assert!(person_2.metadata.index == 2, 4);
        assert!(person_3.metadata.index == 3, 5);
    }

    #[test(framework = @0x1, user_1 = @0x123, user_2 = @321)]
    public fun test_get_person_metadata_by_id(framework: &signer, user_1: &signer, user_2: &signer) acquires GenealogyTreeCollection {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);

        account::create_account_for_test(signer::address_of(user_1));

        let collection_name_1 = string::utf8(b"collection_name_1");
        let user_id_1 = string::utf8(b"user_id_1");
        let user_id_2 = string::utf8(b"user_id_2");

        init_module(owner);
        init_module_for_testing(owner);

        create_genealogy_tree_collection(
            user_1,
            collection_name_1,
            string::utf8(b"description"),
            string::utf8(b"uri")
        );

        populate_person_metadata(
            user_1,
            collection_name_1,
            user_id_1,
            user_id_1,
            PERSON_GENDER_FEMALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[],
        );
        populate_person_metadata(
            user_2,
            collection_name_1,
            user_id_2,
            user_id_2,
            PERSON_GENDER_MALE,
            string::utf8(b"date_of_birth"),
            string::utf8(b"date_of_death"),
            string::utf8(b"image_uri"),
            vector[],
            vector[ string::utf8(b"1") ],
        );

        let person_user_1 = get_person_by_id(collection_name_1, user_id_1);
        let person_user_2 = get_person_by_id(collection_name_1, user_id_2);

        assert!(person_user_1.metadata.name == user_id_1, 1);
        assert!(person_user_2.metadata.name == user_id_2, 2);
        assert!(person_user_2.relationship.children_ids == vector[ string::utf8(b"1") ], 3);
    }
}