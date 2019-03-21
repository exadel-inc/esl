interface IEWCBaseComponenentStatic {
    is: string;
}

interface IEWCBaseComponent implements IEWCBaseComponenentStatic {
    hello(): this;
}


class EWCBaseComponent implements IEWCBaseComponent {
    static is = 'asdd';
    hellow() {
        return this;
    }
}

export {IEWCBaseComponent};