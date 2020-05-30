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
export default class ApiResponse {
    /**
     * 
     */
    @Column()
    public code: number = 0;

    /**
     * 
     */
    @Column()
    public type: string = "";

    /**
     * 
     */
    @Column()
    public message: string = "";

    constructor(other?: any) {
        if (other) {
            this.code = other.code !== undefined ? other.code : this.code;
            this.type = other.type !== undefined ? other.type : this.type;
            this.message = other.message !== undefined ? other.message : this.message;
        }
    }
}
