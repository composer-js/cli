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
    Put,
    Delete,
} from "@composer-js/service-core";
import { JWTUser, UserUtils } from "@composer-js/core";
import Order from "../models/Order";
import { MongoRepository as Repo } from "typeorm";

/**
 * Handles all REST API requests for the endpoint `/store/order`.
 * 
 * @author <AUTHOR>
 */
@Model(Order)
@Route("/store/order")
class OrderRoute extends ModelRoute<Order> {
    @Config
    protected config: any;

    @Logger
    protected logger: any;
    
    @MongoRepository(Order)
    protected repo?: Repo<Order>;

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
            uid: "Order",
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
    private validate(data: Order): void {
        // TODO Validate input data
    }


    /**
     * Returns all Orders from the system that the user has access to
     */
    @Auth(["jwt"])
    @Get()
    private async findAll(@Param() params: any, @Query() query: any, @AuthUser user?: JWTUser): Promise<Array<Order>> {
        return super.doFindAll(params, query, user);
    }

    /**
     * Create a new Order.
     */
    @Auth(["jwt"])
    @Post()
    @Validate("validate")
    private async create(obj: Order, @AuthUser user?: JWTUser): Promise<Order> {
        const newObj: Order = new Order(obj);

        return super.doCreate(newObj, user);
    }

    /**
     * Returns a single Order from the system that the user has access to
     */
    @Auth(["jwt"])
    @Get("/:id")
    private async findById(@Param("id") id: string, @AuthUser user?: JWTUser): Promise<Order | undefined> {
        return super.doFindById(id, user);
    }

    /**
     * Updates a single Order
     */
    @Auth(["jwt"])
    @Put("/:id")
    @Validate("validate")
    private async update(@Param("id") id: string, obj: Order, @AuthUser user?: JWTUser): Promise<Order> {
        const newObj: Order = new Order(obj);

        return super.doUpdate(id, newObj, user);
    }

    /**
     * Deletes the Order
     */
    @Auth(["jwt"])
    @Delete("/:id")
    private async delete(@Param("id") id: string, @AuthUser user?: JWTUser): Promise<void> {
        return super.doDelete(id, user);
    }
}

export default OrderRoute;
