import { User } from "./user";

export class UserParams {
    gender: string ;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 9;
    orderBy = 'lastActive';
    UniversityList = [];
    MajorList = [];
    YearRangeList = [];

    constructor(user: User) {
       // this.gender = user.gender === 'female' ? 'male' : 'female'
    }
}