import enzymeMatchers from 'enzyme-matchers';
import enzymeSerializer from 'enzyme-to-json/serializer';
import 'rstest-canvas-mock';
import './setup';

expect.addSnapshotSerializer(enzymeSerializer);

const matchers = {};
Object.keys(enzymeMatchers).forEach(matcherName => {
    matchers[matcherName] = function(wrapper, ...args) {
        const result = enzymeMatchers[matcherName].call(this, wrapper, ...args);
        let message = this.isNot ? result.negatedMessage : result.message;

        if (result.contextualInformation.expected) {
            message += `\n${this.utils.RECEIVED_COLOR(result.contextualInformation.expected)}`;
        }

        if (result.contextualInformation.actual) {
            message += `\n${this.utils.EXPECTED_COLOR(result.contextualInformation.actual)}`;
        }

        return { ...result, message: () => message };
    };
});

expect.extend(matchers);
