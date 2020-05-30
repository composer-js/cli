///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import { Column, Entity, Index, Unique } from "typeorm";
import { BaseMongoEntity, Cache, Identifier } from "@composer-js/service-core";

/**
 * 
 *
 * @author <AUTHOR>
 */
@Entity()
@Cache()
@Unique(["uid", "id", "username"])
export default class User extends BaseMongoEntity {
    /**
     * 
     */
    @Identifier
    @Index()
    @Column()
    public id: number = 0;

    /**
     * 
     */
    @Identifier
    @Index()
    @Column()
    public username: string = "";

    /**
     * 
     */
    @Column()
    public firstName: string | undefined = undefined;

    /**
     * 
     */
    @Column()
    public lastName: string | undefined = undefined;

    /**
     * 
     */
    @Column()
    public email: string = "";

    /**
     * 
     */
    @Column()
    public password: string = "";

    /**
     * 
     */
    @Column()
    public phone: string | undefined = undefined;

    /**
     * User Status
     */
    @Column()
    public userStatus: number = 0;

    constructor(other?: any) {
        super(other);
        
        if (other) {
            this.id = other.id !== undefined ? other.id : this.id;
            this.username = other.username !== undefined ? other.username : this.username;
            this.firstName = other.firstName !== undefined ? other.firstName : this.firstName;
            this.lastName = other.lastName !== undefined ? other.lastName : this.lastName;
            this.email = other.email !== undefined ? other.email : this.email;
            this.password = other.password !== undefined ? other.password : this.password;
            this.phone = other.phone !== undefined ? other.phone : this.phone;
            this.userStatus = other.userStatus !== undefined ? other.userStatus : this.userStatus;
        }
    }
}
