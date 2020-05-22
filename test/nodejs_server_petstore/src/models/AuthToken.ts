///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import { Column, Entity, Index, Unique } from "typeorm";
import { Cache, Identifier } from "@composer-js/service-core";

/**
 * 
 *
 * @author <AUTHOR>
 */
@Entity()
@Cache()
@Unique(["uid"])
export default class AuthToken {
    /**
     * 
     */
    @Column()
    public token: string = "";

    constructor(other?: any) {
        if (other) {
            this.token = other.token !== undefined ? other.token : this.token;
        }
    }
}
