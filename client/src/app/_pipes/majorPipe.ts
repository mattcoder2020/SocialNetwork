import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'majorName'
})
export class MajorNamePipe implements PipeTransform {

    majorList = [{ value: 1, display: 'Computer Science'}, 
    { value: 2, display: 'Psychology'}, 
    { value: 3, display: 'Finance'},
    { value: 4, display: 'Business'},
    { value: 5, display: 'Economics'}]

    transform(majorId: any): string {
        // Replace the code below with your logic to convert the university ID to the university name
        // For example, you can fetch the university name from an API or use a predefined mapping
        var index = this.majorList.findIndex(e=>e.value==majorId);
        if (index>-1) return this.majorList[index].display;
        
       
        return 'Unknown Major';
       
    }
}
