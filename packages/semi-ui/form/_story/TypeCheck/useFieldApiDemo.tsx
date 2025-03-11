import { useFieldApi } from '@douyinfe/semi-ui/form';

interface FormData {
    test: number;
    test2: string;
    optional?: {
        testL: string;
        testM?: {
            testN?: {
                testO?: Date;
                testP: number;
                testQ: RegExp;
                testR: {
                    R1: string;
                    R2: number;
                    R3: Array<{
                        R31: string;
                        R32: number;
                        R33: boolean
                    }>
                };
                testS: Set<string>;
                testT: Map<string, number>
            }
        }
    }
}

const FCDemo = () => {
    let fieldApi = useFieldApi<FormData, 'test'>('test');
    let numberVal = fieldApi.getValue(); 
    numberVal.toFixed(2);
    let field2Api = useFieldApi<FormData, 'test2'>('test2');
    let stringVal = field2Api.getValue();
    stringVal.toLocaleUpperCase();

    let fieldOptional = useFieldApi<FormData, 'optional'>('optional');
    let optionalVal = fieldOptional.getValue();
    optionalVal.testM.testN.testO.getFullYear();
    let SSet = optionalVal.testM.testN.testS;
    SSet.add('123');
    let TMap = optionalVal.testM.testN.testT;
    TMap.set('123', 123);
};

// 单个泛型参数，没有办法收窄，暂不提供
const OneParamsDemo = () => {
    let fieldApi = useFieldApi<FormData>('test');
    let numberVal = fieldApi.getValue(); 
    numberVal.toFixed(2);
    let field2Api = useFieldApi<FormData>('test2');
    let stringVal = field2Api.getValue();
    stringVal.toLocaleUpperCase();
};

// 
const WithOutGenericDemo = () => {
    let fieldApi = useFieldApi('test');
    let numberVal = fieldApi.getValue(); 
    numberVal.toFixed(2);
    let field2Api = useFieldApi('test2');
    let stringVal = field2Api.getValue();
    stringVal.toLocaleUpperCase();
};

export default FCDemo;

/*


*/