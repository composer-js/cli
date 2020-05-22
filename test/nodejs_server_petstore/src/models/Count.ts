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
export default class Count {
    /**
     * 
     */
    @Column()
    public count: number = 0;

    constructor(other?: any) {
        if (other) {
            this.count = other.count !== undefined ? other.count : this.count;
        }
    }
}
