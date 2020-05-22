///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import {
    AccessControlList,
    ACLRecord,
    Auth,
    Config,
    Init,
    Logger,
    Model,
    ModelRoute,
    MongoRepository,
    ModelUtils,
    Param,
    Query,
    Route,
    User as AuthUser,
    Validate,
    Get,
    Post,
    Delete,
    Put,
} from "@composer-js/service-core";
import { JWTUser, UserUtils } from "@composer-js/core";
import Pet from "../models/Pet";
import Category from "../models/Category";
import Tag from "../models/Tag";
import { MongoRepository as Repo } from "typeorm";

/**
 * Handles all REST API requests for the endpoint `/pet`.
 * 
 * @author <AUTHOR>
 */
@Model(Pet)
@Route("/pet")
class PetRoute extends ModelRoute<Pet> {
    @Config
    protected config: any;

    @Logger
    protected logger: any;
    
    @MongoRepository(Pet)
    protected repo?: Repo<Pet>;

    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {
        super();
    }
    /**
     * Called by the system on startup to create the default access control list for objects of this type.
     */
    protected getDefaultACL(): AccessControlList | undefined {
        // TODO Customize default ACL for this type
        const records: ACLRecord[] = [];

        // Everyone has read-only access
        records.push({
            userOrRoleId: ".*",
            create: false,
            read: true,
            update: false,
            delete: false,
            special: false,
            full: false,
        });

        return {
            uid: "Pet",
            dateCreated: new Date(),
            dateModified: new Date(),
            version: 0,
            records,
        };
    }

    /**
     * Called on server startup to initialize the route with any defaults.
     */
    @Init
    private async initialize() {
        // TODO Add business logic here
    }

    /**
     * Determines if the specified request payload is valid and can be accepted.
     *
     * @throws When the request payload contains invalid input or data.
     */
    private validate(data: Pet): void {
        // TODO Validate input data
    }


    /**
     * Multiple Pet objects
     */
    @Get()
    private async find(@AuthUser user?: JWTUser): Promise<Array<Pet>> {
        throw new Error("This route is not implemented.");
            }

    /**
     * Add a new pet to the store
     */
    @Auth(["jwt"])
    @Post()
    private async add(obj: Pet, @AuthUser user?: JWTUser): Promise<Pet> {
        const newObj: Pet = new Pet(obj);

        throw new Error("This route is not implemented.");
            }

    /**
     * Removes all pets from the store.
     */
    @Auth(["jwt"])
    @Delete()
    private async truncate(@AuthUser user?: JWTUser): Promise<void> {
        return super.doTruncate(user);
    }

    /**
     * Returns a single Pet from the system that the user has access to
     */
    @Get("/:id")
    private async findById(@Param("id") id: string, @AuthUser user?: JWTUser): Promise<Pet | undefined> {
        return super.doFindById(id, user);
    }

    /**
     * Updates a single Pet
     */
    @Auth(["jwt"])
    @Put("/:id")
    @Validate("validate")
    private async update(@Param("id") id: string, obj: Pet, @AuthUser user?: JWTUser): Promise<Pet> {
        const newObj: Pet = new Pet(obj);

        return super.doUpdate(id, newObj, user);
    }

    /**
     * Deletes the Pet
     */
    @Auth(["jwt"])
    @Delete("/:id")
    private async delete(@Param("id") id: string, @AuthUser user?: JWTUser): Promise<void> {
        return super.doDelete(id, user);
    }
}

export default PetRoute;
