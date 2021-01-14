import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/core";
import { EntityManager, Repository } from "typeorm";
import { AttendeesOnline } from "./attendees-online.entity";

@Injectable()
export class AttendeesOnlineService extends BaseService {
    constructor(
        @InjectRepository(AttendeesOnline) private readonly attendeesOnlineRepo: Repository<AttendeesOnline>,
        @InjectEntityManager() private readonly entityManager: EntityManager
    ) {
        super()
    }
}