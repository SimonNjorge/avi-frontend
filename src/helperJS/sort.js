export function withinRange (array, range) {
    let sorted = [];
    //we loop through the input array and groups for each outcome
    //For outcomes to exist together the difference btw group admin(array[i])
    //and each group member should not be more than the range
    for (let i = 0; i < array.length; i++) {
        let current = Number(array[i].outcome);
        let grouped = [array[i]];
        //console.log(current);  
        for (let i2 = 0; i2 < array.length; i2++) {
            if (i !== i2) {
                let dif = Math.abs(current - Number(array[i2].outcome))
                //console.log(dif);
                if (dif < range) {
                    grouped.push(array[i2])
                }
            }
        }  
        sorted.push(grouped);
    }
    //We will pick the group with the most members
    let finalSort = [];
    //console.log(sorted);
    for(let i = 0; i < sorted.length; i++){
        if(sorted[i].length > finalSort.length){
            finalSort = sorted[i];
        }
    }
    return finalSort;
}
