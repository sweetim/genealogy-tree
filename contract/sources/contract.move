module genealogy_tree::contract {
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_std::smart_vector;
    use aptos_std::smart_vector::SmartVector;
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::object::{ExtendRef, TransferRef};
    use aptos_framework::timestamp;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct PersonMetadataDirectory has key {
        person: SmartTable<String, PersonMetadata>,
        count: u256,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct PersonMetadata has key, store, copy, drop {
        id: String,
        name: String,
        gender: u8,
        date_of_birth: String,
        date_of_death: String,
        image_uri: String,
    }

    #[event]
    struct PersonMetadataRegisteredEvent has key, store, drop, copy {
        user: address,
        person_metadata: PersonMetadata,
        timestamp_us: u64,
    }

    #[event]
    struct PersonMetadataUpdatedEvent has key, store, drop, copy {
        user: address,
        person_id: String,
        timestamp_us: u64,
    }


    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct PersonRelationDirectory has key {
        person: SmartVector<PersonRelation>,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct PersonRelation has key, store, copy, drop {
        source: String,
        target: String,
    }

    #[event]
    struct PersonRelationRegisteredEvent has key, store, drop, copy {
        user: address,
        person_relation: PersonRelation,
        timestamp_us: u64,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct GenealogyTreeManager has key {
        extend_ref: ExtendRef,
        transfer_ref: TransferRef
    }

    const PERSON_GENDER_MALE: u8 = 1;
    const PERSON_GENDER_FEMALE: u8 = 2;

    const PERSON_DIRECTORY_COLLECTION: vector<u8> = b"GENEALOGY_TREE_PERSON_DIRECTORY";

    fun init_module(owner: &signer) {
        let constructor_ref = &object::create_named_object(owner, PERSON_DIRECTORY_COLLECTION);
        let extend_ref = object::generate_extend_ref(constructor_ref);
        let transfer_ref = object::generate_transfer_ref(constructor_ref);
        let object_signer = &object::generate_signer(constructor_ref);

        move_to(object_signer, GenealogyTreeManager {
            extend_ref,
            transfer_ref
        });

        move_to(object_signer, PersonMetadataDirectory {
            person: smart_table::new<String, PersonMetadata>(),
            count: 0,
        });

        move_to(object_signer, PersonRelationDirectory {
            person: smart_vector::new<PersonRelation>(),
        });
    }

    public entry fun create_person_metadata(
        user: &signer,
        id: String,
        name: String,
        gender: u8,
        date_of_birth: String,
        date_of_death: String,
        image_uri: String) acquires PersonMetadataDirectory
    {
        let person_metadata = PersonMetadata {
            id,
            name,
            gender,
            date_of_birth,
            date_of_death,
            image_uri
        };

        let person_metadata_directory = borrow_global_mut<PersonMetadataDirectory>(get_genealogy_tree_address());
        smart_table::upsert(
            &mut person_metadata_directory.person,
            id,
            person_metadata);

        person_metadata_directory.count = person_metadata_directory.count + 1;

        event::emit(PersonMetadataRegisteredEvent {
            person_metadata,
            user: signer::address_of(user),
            timestamp_us: timestamp::now_microseconds()
        })
    }

    public entry fun update_person_metadata(
        user: &signer,
        id: String,
        name: String,
        gender: u8,
        date_of_birth: String,
        date_of_death: String,
        image_uri: String) acquires PersonMetadataDirectory
    {
        let person_metadata_directory = borrow_global_mut<PersonMetadataDirectory>(get_genealogy_tree_address());
        let person_metadata = smart_table::borrow_mut(&mut person_metadata_directory.person, id);

        person_metadata.name = name;
        person_metadata.gender = gender;
        person_metadata.date_of_birth = date_of_birth;
        person_metadata.date_of_death = date_of_death;
        person_metadata.image_uri = image_uri;

        event::emit(PersonMetadataUpdatedEvent {
            person_id: id,
            timestamp_us: timestamp::now_microseconds(),
            user: signer::address_of(user),
        })
    }

    public entry fun mint_person_nft(user: &signer, person_id: String) acquires PersonMetadataDirectory {
        let user_address = signer::address_of(user);

        let person_metadata_directory = borrow_global_mut<PersonMetadataDirectory>(get_genealogy_tree_address());
        let person_metadata = smart_table::borrow(&person_metadata_directory.person, person_id);

        genealogy_tree::nft::mint(
            user_address,
            person_metadata.id,
            person_metadata.name,
            person_metadata.gender,
            person_metadata.date_of_birth,
            person_metadata.date_of_death,
            person_metadata.image_uri,
        );
    }

    public entry fun create_person_relation(
        user: &signer,
        source: String,
        target: String) acquires PersonRelationDirectory
    {
        let person_relation = PersonRelation {
            source,
            target
        };

        let person_relation_directory = borrow_global_mut<PersonRelationDirectory>(get_genealogy_tree_address());
        smart_vector::push_back(
            &mut person_relation_directory.person,
            person_relation);

        event::emit(PersonRelationRegisteredEvent {
            person_relation,
            user: signer::address_of(user),
            timestamp_us: timestamp::now_microseconds()
        })
    }

    #[view]
    public fun get_genealogy_tree_address(): address {
        object::create_object_address(&@genealogy_tree, PERSON_DIRECTORY_COLLECTION)
    }

    #[view]
    public fun get_person_by_id(id: String): PersonMetadata acquires PersonMetadataDirectory {
        let person_metadata_directory = borrow_global<PersonMetadataDirectory>(get_genealogy_tree_address());
        *smart_table::borrow(&person_metadata_directory.person, id)
    }

    #[view]
    public fun get_all_person_relation(): vector<PersonRelation> acquires PersonRelationDirectory {
        let person_metadata_directory = borrow_global<PersonRelationDirectory>(get_genealogy_tree_address());

        smart_vector::to_vector(&person_metadata_directory.person)
    }

    #[view]
    public fun get_all_person_metadata(): vector<PersonMetadata> acquires PersonMetadataDirectory {
        let person_metadata_directory = borrow_global<PersonMetadataDirectory>(get_genealogy_tree_address());

        let output = vector[];

        smart_table::for_each_ref(&person_metadata_directory.person, |_key, value| {
            vector::push_back(&mut output, *value);
        });

        output
    }
}