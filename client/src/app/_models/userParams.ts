import { User } from "./user";

export class UserParams {
    gender: string | undefined;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 9;
    orderBy = 'lastActive';
    UniversityList = [];
    MajorList = [];
    YearRangeList: number[] = [];
    GenderList: string[] = [];

  
    constructor() {
       // this.gender = user.gender === 'female' ? 'male' : 'female'
    }
}