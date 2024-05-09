module genealogy_tree::nft {
    use std::signer;
    use std::string;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table;
    use aptos_std::smart_table::SmartTable;
    use aptos_std::string_utils;

    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::object::ExtendRef;
    use aptos_framework::timestamp;
    use aptos_token_objects::aptos_token;

    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::event::emitted_events;

    friend genealogy_tree::contract;

    struct CreatorCapabilities has key, store, drop {
        extend_ref: ExtendRef
    }

    struct CollectionCreator has key {
        creator: SmartTable<String, CreatorCapabilities>
    }

    #[event]
    struct PersonNftMintEvent has key, store, drop, copy {
        collection_name: String,
        timestamp_us: u64,
        user: address,
        id: String,
        nft_address: address,
    }

    fun init_module(owner: &signer) {
        move_to(owner, CollectionCreator {
            creator: smart_table::new<String, CreatorCapabilities>()
        });
    }

    public(friend) fun create_collection(
        user: &signer,
        name: String,
        description: String,
        uri: String) acquires CollectionCreator
    {
        let collection_creator = borrow_global_mut<CollectionCreator>(@genealogy_tree);

        let user_address = signer::address_of(user);
        let user_constructor_ref = &object::create_object(user_address);
        let user_extend_ref = object::generate_extend_ref(user_constructor_ref);

        smart_table::upsert(&mut collection_creator.creator, name, CreatorCapabilities {
            extend_ref: user_extend_ref
        });

        let user_signer = &object::generate_signer(user_constructor_ref);

        aptos_token::create_collection(
            user_signer,
            description,
            1_000_000_000,
            name,
            uri,
            true,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            0,
            100
        );
    }

    public(friend) fun mint(
        collection_name: String,
        to_user: address,
        id: String,
        index: u64,
        name: String,
        gender: u8,
        date_of_birth: String,
        date_of_death: String,
        image_uri: String,
        parent_names: vector<String>,
        children_names: vector<String>) acquires CollectionCreator
    {
        let collection_creator = &borrow_global<CollectionCreator>(@genealogy_tree).creator;

        let creator_capabilities = smart_table::borrow(collection_creator, collection_name);
        let creator_signer = &object::generate_signer_for_extending(&creator_capabilities.extend_ref);

        let description = string_utils::format2(&b"Member number {} of {}", index, collection_name);
        let minted_timestamp = timestamp::now_microseconds();
        let parents_text = vector::fold(parent_names, string::utf8(b""), |acc, n| string_utils::format2(&b"{},{}", acc, n));
        let children_text = vector::fold(children_names, string::utf8(b""), |acc, n| string_utils::format2(&b"{},{}", acc, n));

        let nft = aptos_token::mint_token_object(
            creator_signer,
            collection_name,
            description,
            name,
            image_uri,
            vector[],
            vector[],
            vector[],
        );

        aptos_token::add_typed_property(creator_signer, nft, string::utf8(b"Name"), name);
        aptos_token::add_typed_property(creator_signer, nft, string::utf8(b"Gender"), get_gender_string(gender));
        aptos_token::add_typed_property(creator_signer, nft, string::utf8(b"Date of birth"), date_of_birth);
        aptos_token::add_typed_property(creator_signer, nft, string::utf8(b"Date of death"), date_of_death);
        aptos_token::add_typed_property(creator_signer, nft, string::utf8(b"Descendent number"), index);
        aptos_token::add_typed_property(creator_signer, nft, string::utf8(b"Parents"), parents_text);
        aptos_token::add_typed_property(creator_signer, nft, string::utf8(b"Childrens"), children_text);

        object::transfer(creator_signer, nft, to_user);

        event::emit(PersonNftMintEvent {
            collection_name,
            id,
            user: to_user,
            timestamp_us: minted_timestamp,
            nft_address: object::object_address(&nft)
        })
    }

    fun get_gender_string(gender: u8): String {
        if (gender == 1) return string::utf8(b"MALE");
        if (gender == 2) return string::utf8(b"FEMALE");

        return string::utf8(b"UNKNOWN")
    }

    #[test_only]
    public fun init_module_for_testing(owner: &signer) {
        init_module(owner);
    }

    #[test(framework = @0x1, user_1 = @0x123)]
    public fun test_nft_mint(framework: &signer, user_1: &signer) acquires CollectionCreator {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);
        let user_1_address= signer::address_of(user_1);
        account::create_account_for_test(user_1_address);

        let collection_name = string::utf8(b"collection_name");
        let id = string::utf8(b"id");
        let index = 1;
        let name = string::utf8(b"name");
        let gender = 1;
        let date_of_birth = string::utf8(b"2020-01-02");
        let date_of_death = string::utf8(b"");
        let image_uri = string::utf8(b"iamge_uri");

        init_module(owner);
        create_collection(
            user_1,
            collection_name,
            string::utf8(b"description"),
            string::utf8(b"uri"),
        );

        mint(
            collection_name,
            user_1_address,
            id,
            index,
            name,
            gender,
            date_of_birth,
            date_of_death,
            image_uri,
            vector[],
            vector[],
        );

        let all_emitted_events = &emitted_events<PersonNftMintEvent>();
        assert!(vector::length(all_emitted_events) == 1, 1);
    }

    #[test(framework = @0x1, user_1 = @0x123)]
    #[expected_failure(abort_code = 65537, location = smart_table)]
    public fun test_nft_mint_without_creating_collection(framework: &signer, user_1: &signer) acquires CollectionCreator {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);
        let user_1_address= signer::address_of(user_1);
        account::create_account_for_test(user_1_address);

        init_module(owner);

        let collection_name = string::utf8(b"collection_name");
        let id = string::utf8(b"id");
        let index = 1;
        let name = string::utf8(b"name");
        let gender = 1;
        let date_of_birth = string::utf8(b"2020-01-02");
        let date_of_death = string::utf8(b"");
        let image_uri = string::utf8(b"iamge_uri");

        mint(
            collection_name,
            user_1_address,
            id,
            index,
            name,
            gender,
            date_of_birth,
            date_of_death,
            image_uri,
            vector[string::utf8(b"abc")],
            vector[],
        );

        let all_emitted_events = &emitted_events<PersonNftMintEvent>();
        assert!(vector::length(all_emitted_events) == 1, 1);
    }
}