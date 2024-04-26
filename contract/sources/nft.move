module genealogy_tree::nft {
    use std::signer;
    use std::string;
    use std::string::String;
    use aptos_std::string_utils;

    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::object::ExtendRef;
    use aptos_framework::timestamp;
    use aptos_token_objects::aptos_token;

    #[test_only]
    use std::vector;
    #[test_only]
    use aptos_framework::account;
    #[test_only]
    use aptos_framework::event::emitted_events;

    friend genealogy_tree::contract;

    struct NftCollectionCreator has key {
        extend_ref: ExtendRef
    }

    #[event]
    struct PersonNftMintEvent has key, store, drop, copy {
        timestamp_us: u64,
        user: address,
        id: String,
        nft_address: address,
    }

    const COLLECTION_NAME: vector<u8> = b"LOH Family";

    fun init_module(owner: &signer) {
        let owner_address = signer::address_of(owner);
        let owner_constructor_ref = &object::create_object(owner_address);
        let owner_extend_ref = object::generate_extend_ref(owner_constructor_ref);

        move_to(owner, NftCollectionCreator {
            extend_ref: owner_extend_ref
        });

        let owner_signer = &object::generate_signer(owner_constructor_ref);

        aptos_token::create_collection(
            owner_signer,
            string::utf8(b"LOH family ancestry"),
            185,
            string::utf8(COLLECTION_NAME),
            string::utf8(b"https://count.timx.co/loh.jpg"),
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            5,
            100
        );
    }

    public(friend) fun mint(
        to_user: address,
        id: String,
        name: String,
        gender: u8,
        date_of_birth: String,
        date_of_death: String,
        image_uri: String) acquires NftCollectionCreator
    {
        let extend_ref = &borrow_global<NftCollectionCreator>(@genealogy_tree).extend_ref;
        let signer = &object::generate_signer_for_extending(extend_ref);

        let description = string_utils::format1(&b"A member of {}", string::utf8(COLLECTION_NAME));
        let minted_timestamp = timestamp::now_microseconds();

        let nft = aptos_token::mint_token_object(
            signer,
            string::utf8(COLLECTION_NAME),
            description,
            name,
            image_uri,
            vector[],
            vector[],
            vector[],
        );

        aptos_token::add_typed_property(signer, nft, string::utf8(b"Name"), name);
        aptos_token::add_typed_property(signer, nft, string::utf8(b"Gender"), get_gender_string(gender));
        aptos_token::add_typed_property(signer, nft, string::utf8(b"Date of birth"), date_of_birth);
        aptos_token::add_typed_property(signer, nft, string::utf8(b"Date of death"), date_of_death);

        object::transfer(signer, nft, to_user);

        event::emit(PersonNftMintEvent {
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
    public fun test_nft_mint(framework: &signer, user_1: &signer) acquires NftCollectionCreator {
        timestamp::set_time_has_started_for_testing(framework);

        let owner = &account::create_account_for_test(@genealogy_tree);
        let user_1_address= signer::address_of(user_1);
        account::create_account_for_test(user_1_address);

        init_module(owner);

        let id = string::utf8(b"id");
        let name = string::utf8(b"name");
        let gender = 1;
        let date_of_birth = string::utf8(b"2020-01-02");
        let date_of_death = string::utf8(b"");
        let image_uri = string::utf8(b"iamge_uri");

        mint(
            user_1_address,
            id,
            name,
            gender,
            date_of_birth,
            date_of_death,
            image_uri
        );

        let all_emitted_events = &emitted_events<PersonNftMintEvent>();
        assert!(vector::length(all_emitted_events) == 1, 1);
    }
}