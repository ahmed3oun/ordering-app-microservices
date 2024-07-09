import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractDocument } from "./abstract.schema";
import { ClientSession, Connection, FilterQuery, Model, SaveOptions, Types, UpdateQuery } from "mongoose";


export abstract class AbstractRepository<TDocument extends AbstractDocument> {

    protected abstract readonly logger: Logger;

    constructor(
        private readonly model: Model<TDocument>,
        private readonly connection: Connection,
    ) { }

    async create(
        document: Omit<TDocument, '_id'>,
        options?: SaveOptions
    ): Promise<TDocument> {
        const createdDoc = new this.model({
            _id: new Types.ObjectId(),
            ...document,
        });

        return ((await createdDoc.save(options)).toJSON() as unknown as TDocument)
    }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument extends any[] ? import("mongoose").Require_id<import("mongoose").FlattenMaps<TDocument>>[] : import("mongoose").Require_id<import("mongoose").FlattenMaps<TDocument>>> {
        const doc = await this.model.findOne(filterQuery, {}, { lean: true })
        if (!doc) {
            this.logger.warn(`Document not found with filterQuery : `, filterQuery)
            throw new NotFoundException('Document not found');
        }

        return doc;
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>
    ): Promise<TDocument extends any[] ? import("mongoose").Require_id<import("mongoose").FlattenMaps<TDocument>>[] : import("mongoose").Require_id<import("mongoose").FlattenMaps<TDocument>>> {
        const doc = await this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true,
        });

        if (!doc) {
            this.logger.warn(`Document not found with filterQuery:`, filterQuery);
            throw new NotFoundException('Document not found.');
        }

        return doc;
    }

    async upsert(
        filterQuery: FilterQuery<TDocument>,
        document: Partial<TDocument>
    ): Promise<TDocument extends any[] ? import("mongoose").Require_id<import("mongoose").FlattenMaps<TDocument>>[] : import("mongoose").Require_id<import("mongoose").FlattenMaps<TDocument>>> {
        return await this.model.findOneAndUpdate(filterQuery, document, {
            lean: true,
            upsert: true,
            new: true,
        });
    }

    async find(
        filterQuery: FilterQuery<TDocument>,
        limit = 20, offset = 1
    ): Promise<import("mongoose").Require_id < import("mongoose").FlattenMaps < TDocument >>[]> {
        return await this.model.find(filterQuery, {}, { lean: true }).skip(offset).limit(limit)
    }

    async startTransaction(): Promise<ClientSession> {
        const session = await this.connection.startSession();
        session.startTransaction();
        return session;
    }

}