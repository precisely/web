/*
* Copyright (c) 2011-Present, CauseCode Technologies Pvt Ltd, India.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or
* without modification, are not permitted.
*/

export interface IRandomList { 
    list: number[]; 
    length: number; 
    sum: number; 
};

export const random: {list(args: { length: number; }): IRandomList} = {
    list(args: {length: number}) {
        const dataList: number[] = [];
        for (let i = 0; i < args.length; i++) {
            dataList.push(parseInt((Math.random() * 100).toString()));
        }

        return { list: dataList, length: args.length, sum: dataList.reduce((a: number, b: number) => a + b, 0) }
    }
}
