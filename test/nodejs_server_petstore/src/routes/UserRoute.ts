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
import User from "../models/User";
import Count from "../models/Count";
import { MongoRepository as Repo } from "typeorm";

/**
 * Handles all REST API requests for the endpoint `/user`.
 * 
 * @author <AUTHOR>
 */
@Model(User)
@Route("/user")
class UserRoute extends ModelRoute<User> {
    @Config
    protected config: any;

    @Logger
    protected logger: any;
    
    @MongoRepository(User)
    protected repo?: Repo<User>;

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
            uid: "User",
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
    private validate(data: User): void {
        // TODO Validate input data
    }


    /**
     * Returns all Users from the system that the User has access to
     */
    @Auth(["jwt"])
    @Get()
    private async findAll(@Param() params: any, @Query() query: any, @AuthUser user?: JWTUser): Promise<Array<User>> {
        return super.doFindAll(params, query, user);
    }

    /**
     * Create a new User.
     */
    @Auth(["jwt"])
    @Post()
    @Validate("validate")
    private async create(obj: User, @AuthUser user?: JWTUser): Promise<User> {
        const newObj: User = new User(obj);

        return super.doCreate(newObj, user);
    }

    /**
     * Deletes all users from the service.
     */
    @Auth(["jwt"])
    @Delete()
    private async truncate(@AuthUser user?: JWTUser): Promise<void> {
        return super.doTruncate(user);
    }

    /**
     * Returns a single User from the system that the user has access to
     */
    @Auth(["jwt"])
    @Get("/:id")
    private async findById(@Param("id") id: string, @AuthUser user?: JWTUser): Promise<User | undefined> {
        return super.doFindById(id, user);
    }

    /**
     * Updates a single User
     */
    @Auth(["jwt"])
    @Put("/:id")
    @Validate("validate")
    private async update(@Param("id") id: string, obj: User, @AuthUser user?: JWTUser): Promise<User> {
        const newObj: User = new User(obj);

        return super.doUpdate(id, newObj, user);
    }

    /**
     * Deletes the User
     */
    @Auth(["jwt"])
    @Delete("/:id")
    private async delete(@Param("id") id: string, @AuthUser user?: JWTUser): Promise<void> {
        return super.doDelete(id, user);
    }

    /**
     * Returns the count of users based on the given criteria.
     */
    @Get("/count")
    private async count(@Param() params: any, @Query() query: any, @AuthUser user?: JWTUser): Promise<Count> {
        return super.doCount(params, query, user);
    }
}

export default UserRoute;
