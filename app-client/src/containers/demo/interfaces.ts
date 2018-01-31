export type List = {
    length: number;
    list: number[];
    sum: number;
};

export type Response = {
    getRandomList: List;
};

export type InputProps = {
    length: number;
};
