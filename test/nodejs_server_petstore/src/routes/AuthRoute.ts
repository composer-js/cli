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
} from "@composer-js/service-core";
import { JWTUser, UserUtils } from "@composer-js/core";
import AuthToken from "../models/AuthToken";

/**
 * Handles all REST API requests for the endpoint `/user/login`.
 * 
 * @author <AUTHOR>
 */

@Route("/user/login")
class AuthRoute {
    @Config
    protected config: any;

    @Logger
    protected logger: any;
    
    /**
     * Initializes a new instance with the specified defaults.
     */
    constructor() {
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
    private validate(data: any): void {
        // TODO Validate input data
    }


    /**
     * Authenticates the user using HTTP Basic and returns a JSON Web Token access token to be used with future API requests.
     */
    @Auth(["basic"])
    @Get()
    private async login(@AuthUser user?: JWTUser): Promise<AuthToken> {
        throw new Error("This route is not implemented.");
            }

    /**
     * Logs out the current user
     */
    @Auth(["jwt"])
    @Get("/user/logout")
    private async logout(@AuthUser user?: JWTUser): Promise<void> {
        throw new Error("This route is not implemented.");
            }
}

export default AuthRoute;
