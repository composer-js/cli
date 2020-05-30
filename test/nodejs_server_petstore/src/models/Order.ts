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
export default class Order extends BaseMongoEntity {
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
    public petId: number = 0;

    /**
     * 
     */
    @Column()
    public quantity: number = 0;

    /**
     * 
     */
    @Column()
    public shipDate: Date = new Date();

    /**
     * Order Status
     */
    @Column()
    public status: string = "";

    /**
     * 
     */
    @Column()
    public complete: boolean = false;

    constructor(other?: any) {
        super(other);
        
        if (other) {
            this.id = other.id !== undefined ? other.id : this.id;
            this.petId = other.petId !== undefined ? other.petId : this.petId;
            this.quantity = other.quantity !== undefined ? other.quantity : this.quantity;
            this.shipDate = other.shipDate !== undefined ? other.shipDate : this.shipDate;
            this.status = other.status !== undefined ? other.status : this.status;
            this.complete = other.complete !== undefined ? other.complete : this.complete;
        }
    }
}
