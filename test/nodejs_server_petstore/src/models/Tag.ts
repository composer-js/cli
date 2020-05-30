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
@Unique(["uid", "id"])
export default class Tag extends BaseMongoEntity {
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
    @Column()
    public name: string = "";

    constructor(other?: any) {
        super(other);
        
        if (other) {
            this.id = other.id !== undefined ? other.id : this.id;
            this.name = other.name !== undefined ? other.name : this.name;
        }
    }
}
