/* eslint-disable camelcase, comma-dangle */
// 为 react-live 提供 scope
import { Form, Select as BasicSelect } from '@douyinfe/semi-ui';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import InfiniteScroll from 'react-infinite-scroller';
import ReactDOM from 'react-dom';
import { InfiniteLoader, AutoSizer } from 'react-virtualized';
import VList from 'react-virtualized/dist/commonjs/List';

import * as dateFns from 'date-fns';
import classNames from 'classnames';
import { debounce, throttle, range, get, filter, map, some } from 'lodash-es';
import zh_CN from '@douyinfe/semi-ui/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/locale/source/en_GB';
import en_US from '@douyinfe/semi-ui/locale/source/en_US';
import ko_KR from '@douyinfe/semi-ui/locale/source/ko_KR';
import ja_JP from '@douyinfe/semi-ui/locale/source/ja_JP';
import ar from '@douyinfe/semi-ui/locale/source/ar';
import vi_VN from '@douyinfe/semi-ui/locale/source/vi_VN';
import ru_RU from '@douyinfe/semi-ui/locale/source/ru_RU';
import id_ID from '@douyinfe/semi-ui/locale/source/id_ID';
import ms_MY from '@douyinfe/semi-ui/locale/source/ms_MY';
import th_TH from '@douyinfe/semi-ui/locale/source/th_TH';
import tr_TR from '@douyinfe/semi-ui/locale/source/tr_TR';
import pt_BR from '@douyinfe/semi-ui/locale/source/pt_BR';
import zh_TW from '@douyinfe/semi-ui/locale/source/zh_TW';
import es from '@douyinfe/semi-ui/locale/source/es';
import de from '@douyinfe/semi-ui/locale/source/de';
import it from '@douyinfe/semi-ui/locale/source/it';
import fr from '@douyinfe/semi-ui/locale/source/fr';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import GraphemeSplitter from 'grapheme-splitter';

export * from '@douyinfe/semi-ui';
export * from '@douyinfe/semi-foundation/utils';
export * from '@douyinfe/semi-icons';
export * from '@douyinfe/semi-illustrations';

export {
    dateFns,
    DndProvider,
    DragSource,
    DropTarget,
    HTML5Backend,
    update,
    InfiniteScroll,
    ReactDOM,
    InfiniteLoader,
    AutoSizer,
    VList,
    classNames,
    GraphemeSplitter,
};

export { default as classnames } from 'classnames';

export * from 'react-resizable';

// Form Field Scope
const {
    Input,
    Select,
    DatePicker,
    Switch,
    Slider,
    CheckboxGroup,
    Checkbox,
    RadioGroup,
    Radio,
    TimePicker,
    InputNumber,
} = Form;

const FormInput = Input;
const FormSelect = Select;
const FormDatePicker = DatePicker;
const FormSwitch = Switch;
const FormSlider = Slider;
const FormCheckboxGroup = CheckboxGroup;
const FormCheckbox = Checkbox;
const FormRadioGroup = RadioGroup;
const FormRadio = Radio;
const FormTimePicker = TimePicker;
const FormInputNumber = InputNumber;

const { Option } = BasicSelect;

export { Option };

export {
    FormInput,
    FormSelect,
    FormDatePicker,
    FormSwitch,
    FormCheckboxGroup,
    FormSlider,
    FormCheckbox,
    FormRadioGroup,
    FormRadio,
    FormTimePicker,
    FormInputNumber,
};

export { SortableContainer, SortableElement, sortableHandle };

export {
    useState,
    useEffect,
    useContext,
    useReducer,
    useCallback,
    useMemo,
    useRef,
    useImperativeHandle,
    useLayoutEffect,
    useDebugValue,
    forwardRef
} from 'react';

export { debounce, throttle, range, get, filter, map, some };

export { zh_CN, en_GB, en_US, ko_KR, ja_JP, ar, vi_VN, ru_RU, id_ID, ms_MY, th_TH, tr_TR, pt_BR, zh_TW, es, de, it, fr };
