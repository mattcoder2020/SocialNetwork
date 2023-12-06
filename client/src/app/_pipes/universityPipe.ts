import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'universityName'
})
export class UniversityNamePipe implements PipeTransform {

    universityList = [{ value: 1, display: 'Harvard University'}, 
    { value: 2, display: 'Stanford University'}, 
    { value: 3, display: 'Harvard University'},
    { value: 4, display: 'University of Cambridge'},
    { value: 5, display: 'University of Oxford'}]

    transform(universityId: number): string {
        // Replace the code below with your logic to convert the university ID to the university name
        // For example, you can fetch the university name from an API or use a predefined mapping
        var index = this.universityList.findIndex(e=>e.value==universityId);
        if (index>-1) return this.universityList[index].display;
        
       
        return 'Unknown University';
       
    }
}
