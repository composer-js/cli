///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2020 <COPYRIGHT>
///////////////////////////////////////////////////////////////////////////////
import { Column, Entity, Index, Unique } from "typeorm";
import { BaseMongoEntity, Cache, Identifier } from "@composer-js/service-core";
import Category from "./Category";
import Tag from "./Tag";

/**
 * 
 *
 * @author <AUTHOR>
 */
@Entity()
@Cache()
@Unique(["uid", "id", "name"])
export default class Pet extends BaseMongoEntity {
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
    public category: Category | undefined = undefined;

    /**
     * 
     */
    @Identifier
    @Index()
    @Column()
    public name: string = "";

    /**
     * 
     */
    @Column()
    public photoUrls: Array<string> = [];

    /**
     * 
     */
    @Column()
    public tags: Array<Tag> = [];

    /**
     * pet status in the store
     */
    @Column()
    public status: string = "";

    constructor(other?: any) {
        super(other);
        
        if (other) {
            this.id = other.id !== undefined ? other.id : this.id;
            this.category = other.category !== undefined ? other.category : this.category;
            this.name = other.name !== undefined ? other.name : this.name;
            this.photoUrls = other.photoUrls !== undefined ? other.photoUrls : this.photoUrls;
            this.tags = other.tags !== undefined ? other.tags : this.tags;
            this.status = other.status !== undefined ? other.status : this.status;
        }
    }
}
