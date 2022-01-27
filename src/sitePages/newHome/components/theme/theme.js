export const larkTheme = `/* shadow */
/* sizing */
/* spacing */
.semi-descriptions {
  line-height: 20px; }
  .semi-descriptions table,
.semi-descriptions tr,
.semi-descriptions th,
.semi-descriptions td {
    margin: 0;
    padding: 0;
    border: 0; }
  .semi-descriptions th {
    padding-right: 24px; }
  .semi-descriptions .semi-descriptions-item {
    margin: 0;
    padding-bottom: 12px;
    text-align: left;
    vertical-align: top; }
  .semi-descriptions-key {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    min-height: 14px;
    white-space: nowrap;
    color: var(--semi-color-text-2); }
  .semi-descriptions-value {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-0); }
  .semi-descriptions-center .semi-descriptions-item-th {
    text-align: right; }
  .semi-descriptions-center .semi-descriptions-item-td {
    text-align: left; }
  .semi-descriptions-left .semi-descriptions-item-th,
.semi-descriptions-left .semi-descriptions-item-td {
    text-align: left; }
  .semi-descriptions-justify .semi-descriptions-item-th {
    text-align: left; }
  .semi-descriptions-justify .semi-descriptions-item-td {
    text-align: right; }
  .semi-descriptions-plain .semi-descriptions-key,
.semi-descriptions-plain .semi-descriptions-value {
    display: inline-block; }
  .semi-descriptions-plain .semi-descriptions-value {
    padding-left: 8px; }
    .semi-descriptions-plain .semi-descriptions-value .semi-tag {
      vertical-align: middle; }
  .semi-descriptions-double tbody {
    display: flex;
    flex-wrap: wrap; }
  .semi-descriptions-double tr {
    display: inline-flex;
    flex-direction: column; }
  .semi-descriptions-double .semi-descriptions-item {
    padding: 0;
    flex: 1; }
  .semi-descriptions-double .semi-descriptions-value {
    font-weight: 600; }
  .semi-descriptions-double-small .semi-descriptions-item {
    padding-right: 48px; }
  .semi-descriptions-double-small .semi-descriptions-key {
    font-size: 12px;
    line-height: 16px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding-bottom: 0; }
  .semi-descriptions-double-small .semi-descriptions-value {
    font-size: 16px;
    line-height: 22px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-descriptions-double-medium .semi-descriptions-item {
    padding-right: 60px; }
  .semi-descriptions-double-medium .semi-descriptions-key {
    padding-bottom: 4px; }
  .semi-descriptions-double-medium .semi-descriptions-value {
    font-size: 18px;
    line-height: 28px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-descriptions-double-large .semi-descriptions-item {
    padding-right: 80px; }
  .semi-descriptions-double-large .semi-descriptions-key {
    padding-bottom: 4px; }
  .semi-descriptions-double-large .semi-descriptions-value {
    font-size: 28px;
    line-height: 40px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }

.semi-typography {
  color: var(--semi-color-text-0);
  font-size: 14px;
  line-height: 20px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-typography.semi-typography-secondary {
    color: var(--semi-color-text-1); }
  .semi-typography.semi-typography-tertiary {
    color: var(--semi-color-text-2); }
  .semi-typography.semi-typography-quaternary {
    color: var(--semi-color-text-3); }
  .semi-typography.semi-typography-warning {
    color: var(--semi-color-warning); }
  .semi-typography.semi-typography-success {
    color: var(--semi-color-success); }
  .semi-typography.semi-typography-danger {
    color: var(--semi-color-danger); }
  .semi-typography.semi-typography-link {
    color: var(--semi-color-link);
    font-weight: 600; }
  .semi-typography.semi-typography-disabled {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
    user-select: none; }
    .semi-typography.semi-typography-disabled.semi-typography-link {
      color: var(--semi-color-link); }
  .semi-typography-icon {
    margin-right: 4px;
    vertical-align: middle;
    color: inherit; }
  .semi-typography-small {
    font-size: 12px;
    line-height: 16px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-typography code {
    border: 1px solid var(--semi-color-border);
    border-radius: 2px;
    color: var(--semi-color-text-2);
    background-color: var(--semi-color-fill-1);
    padding: 2px 4px; }
  .semi-typography mark {
    background-color: var(--semi-color-primary-light-default); }
  .semi-typography u {
    text-decoration: underline;
    text-decoration-skip-ink: auto; }
  .semi-typography del {
    text-decoration: line-through; }
  .semi-typography strong {
    font-weight: 600; }
  .semi-typography a {
    display: inline;
    color: var(--semi-color-link);
    cursor: pointer;
    text-decoration: none; }
    .semi-typography a:visited {
      color: var(--semi-color-link-visited); }
    .semi-typography a:hover {
      color: var(--semi-color-link-hover); }
    .semi-typography a:active {
      color: var(--semi-color-link-active); }
    .semi-typography a .semi-typography-link-underline:hover {
      border-bottom: 1px solid var(--semi-color-link-hover);
      margin-bottom: -1px; }
    .semi-typography a .semi-typography-link-underline:active {
      border-bottom: 1px solid var(--semi-color-link-active);
      margin-bottom: -1px; }
  .semi-typography-ellipsis-single-line {
    overflow: hidden; }
  .semi-typography-ellipsis-multiple-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden; }
  .semi-typography-ellipsis-overflow-ellipsis {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis; }
  .semi-typography-ellipsis-expand {
    display: inline;
    margin-left: 8px; }
  .semi-typography-action-copy {
    display: inline-flex;
    vertical-align: text-bottom;
    padding: 0;
    margin-left: 4px; }
  .semi-typography a.semi-typography-action-copy-icon {
    display: inline-flex; }
  .semi-typography-action-copied {
    display: inline-flex;
    padding: 0;
    margin-left: 4px;
    color: var(--semi-color-text-2); }
    .semi-typography-action-copied .semi-icon {
      vertical-align: text-bottom;
      color: var(--semi-color-success); }
  .semi-typography-paragraph {
    margin: 0; }

h1.semi-typography,
.semi-typography-h1.semi-typography {
  font-size: 32px;
  line-height: 44px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h2.semi-typography,
.semi-typography-h2.semi-typography {
  font-size: 28px;
  line-height: 40px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h3.semi-typography,
.semi-typography-h3.semi-typography {
  font-size: 24px;
  line-height: 32px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h4.semi-typography,
.semi-typography-h4.semi-typography {
  font-size: 18px;
  line-height: 28px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h5.semi-typography,
.semi-typography-h5.semi-typography {
  font-size: 18px;
  line-height: 24px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h6.semi-typography,
.semi-typography-h6.semi-typography {
  font-size: 16px;
  line-height: 22px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

p.semi-typography-extended,
.semi-typography-paragraph.semi-typography-extended {
  line-height: 24px; }

.semi-input-textarea-wrapper {
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 100%;
  border: 1px #BBBFC4 solid;
  border-radius: var(--semi-border-radius-small);
  vertical-align: bottom;
  background-color: var(--semi-color-fill-0); }
  .semi-input-textarea-wrapper:hover {
    background-color: var(--semi-color-fill-1); }
  .semi-input-textarea-wrapper-focus {
    background-color: var(--semi-color-fill-0);
    border: 1px var(--semi-color-primary) solid; }
    .semi-input-textarea-wrapper-focus:hover, .semi-input-textarea-wrapper-focus:active {
      background-color: var(--semi-color-fill-0); }
  .semi-input-textarea-wrapper:active {
    background-color: var(--semi-color-fill-2); }
  .semi-input-textarea-wrapper .semi-input-clearbtn {
    position: absolute;
    top: 0;
    min-width: 24px;
    color: var(--semi-color-text-2);
    right: 4px;
    height: 32px; }
    .semi-input-textarea-wrapper .semi-input-clearbtn > svg {
      pointer-events: none; }
    .semi-input-textarea-wrapper .semi-input-clearbtn:hover {
      cursor: pointer; }
      .semi-input-textarea-wrapper .semi-input-clearbtn:hover .semi-icon {
        color: var(--semi-color-primary-hover); }
    .semi-input-textarea-wrapper .semi-input-clearbtn-hidden {
      visibility: hidden; }
  .semi-input-textarea-wrapper-readonly {
    cursor: default; }
  .semi-input-textarea-wrapper-disabled {
    cursor: not-allowed;
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill); }
    .semi-input-textarea-wrapper-disabled:hover {
      background-color: var(--semi-color-disabled-fill); }
    .semi-input-textarea-wrapper-disabled::placeholder {
      color: var(--semi-color-disabled-text); }
  .semi-input-textarea-wrapper-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default); }
    .semi-input-textarea-wrapper-error:hover {
      background-color: var(--semi-color-danger-light-hover);
      border-color: var(--semi-color-danger-light-hover); }
    .semi-input-textarea-wrapper-error.semi-input-textarea-wrapper-focus {
      background-color: var(--semi-color-danger-light-default);
      border-color: var(--semi-color-danger); }
    .semi-input-textarea-wrapper-error:active {
      background-color: var(--semi-color-danger-light-active);
      border-color: var(--semi-color-danger-light-active); }
  .semi-input-textarea-wrapper-warning {
    background-color: var(--semi-color-warning-light-default);
    border-color: var(--semi-color-warning-light-default); }
    .semi-input-textarea-wrapper-warning:hover {
      background-color: var(--semi-color-warning-light-hover);
      border-color: var(--semi-color-warning-light-hover); }
    .semi-input-textarea-wrapper-warning.semi-input-textarea-wrapper-focus {
      background-color: var(--semi-color-warning-light-default);
      border-color: var(--semi-color-warning); }
    .semi-input-textarea-wrapper-warning:active {
      background-color: var(--semi-color-warning-light-active);
      border-color: var(--semi-color-warning-light-active); }

.semi-input-textarea {
  position: relative;
  resize: none;
  padding: 5px 12px;
  box-shadow: none;
  font-size: 14px;
  line-height: 20px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: transparent;
  border: 0 solid transparent;
  vertical-align: bottom;
  width: 100%;
  outline: none;
  cursor: text;
  box-sizing: border-box;
  color: var(--semi-color-text-0); }
  .semi-input-textarea::placeholder {
    color: var(--semi-color-text-2); }
  .semi-input-textarea-showClear {
    padding-right: 36px; }
  .semi-input-textarea-disabled {
    cursor: not-allowed;
    color: var(--semi-color-disabled-text);
    background-color: transparent; }
    .semi-input-textarea-disabled:hover {
      background-color: transparent; }
    .semi-input-textarea-disabled::placeholder {
      color: var(--semi-color-disabled-text); }
  .semi-input-textarea-autosize {
    overflow: hidden; }
  .semi-input-textarea-counter {
    font-size: 12px;
    line-height: 16px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3px 12px 5px 12px;
    min-height: 24px;
    text-align: right;
    color: var(--semi-color-text-2); }
    .semi-input-textarea-counter-exceed {
      color: var(--semi-color-danger); }

.semi-select {
  box-sizing: border-box;
  border-radius: var(--semi-border-radius-small);
  border: 1px solid #BBBFC4;
  height: 32px;
  font-weight: 400;
  background-color: var(--semi-color-fill-0);
  display: inline-flex;
  vertical-align: middle;
  position: relative;
  outline: none;
  cursor: pointer; }
  .semi-select:hover {
    background-color: var(--semi-color-fill-1); }
  .semi-select:active {
    background-color: var(--semi-color-fill-2); }
  .semi-select:focus {
    border: 1px solid var(--semi-color-focus-border);
    outline: 0; }
  .semi-select-small {
    height: 24px;
    line-height: 24px; }
  .semi-select-large {
    min-height: 40px;
    line-height: 40px; }
  .semi-select-open, .semi-select-focus {
    border: 1px solid var(--semi-color-focus-border);
    outline: 0; }
    .semi-select-open:hover, .semi-select-focus:hover {
      background-color: var(--semi-color-fill-0); }
  .semi-select-warning {
    background-color: var(--semi-color-warning-light-default);
    border-color: var(--semi-color-warning-light-default); }
    .semi-select-warning:hover {
      background-color: var(--semi-color-warning-light-hover);
      border-color: var(--semi-color-warning-light-hover); }
    .semi-select-warning:focus {
      background-color: var(--semi-color-warning-light-default);
      border-color: var(--semi-color-warning); }
    .semi-select-warning:active {
      background-color: var(--semi-color-warning-light-active);
      border-color: var(--semi-color-warning-light-active); }
  .semi-select-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default); }
    .semi-select-error:hover {
      background-color: var(--semi-color-danger-light-hover);
      border-color: var(--semi-color-danger-light-hover); }
    .semi-select-error:focus {
      background-color: var(--semi-color-danger-light-default);
      border-color: var(--semi-color-danger); }
    .semi-select-error:active {
      background-color: var(--semi-color-danger-light-active);
      border-color: var(--semi-color-danger-light-active); }
  .semi-select-disabled {
    cursor: not-allowed;
    background-color: var(--semi-color-disabled-fill); }
    .semi-select-disabled:hover {
      background-color: var(--semi-color-disabled-fill); }
    .semi-select-disabled:focus {
      border: 1px solid var(--semi-color-focus-border); }
    .semi-select-disabled .semi-select-selection,
.semi-select-disabled .semi-select-selection-placeholder {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed; }
    .semi-select-disabled .semi-select-arrow,
.semi-select-disabled .semi-select-prefix,
.semi-select-disabled .semi-select-suffix {
      color: var(--semi-color-disabled-text); }
    .semi-select-disabled .semi-tag {
      color: var(--semi-color-disabled-text);
      background-color: transparent; }
  .semi-select-selection {
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    height: 100%;
    display: flex;
    align-items: center;
    flex-grow: 1;
    overflow: hidden;
    margin-left: 12px;
    cursor: pointer;
    color: var(--semi-color-text-0); }
    .semi-select-selection-text {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis; }
      .semi-select-selection-text-inactive {
        display: flex;
        opacity: 0.4; }
      .semi-select-selection-text-hide {
        display: none; }
    .semi-select-selection-placeholder {
      color: var(--semi-color-text-2); }
    .semi-select-selection .semi-tag {
      margin-top: 1px;
      margin-right: 4px;
      margin-bottom: 1px; }
      .semi-select-selection .semi-tag:nth-of-type(1) {
        margin-left: 0; }
    .semi-select-selection .semi-tag-group {
      height: inherit; }
      .semi-select-selection .semi-tag-group .semi-tag {
        margin-top: 1px;
        margin-right: 4px;
        margin-bottom: 1px; }
  .semi-select-content-wrapper {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 100%; }
  .semi-select-multiple {
    height: auto; }
    .semi-select-multiple .semi-select-selection {
      margin-left: 4px; }
    .semi-select-multiple .semi-select-content-wrapper {
      width: 100%;
      min-height: 30px;
      flex-wrap: wrap; }
      .semi-select-multiple .semi-select-content-wrapper-empty {
        margin-left: 8px; }
      .semi-select-multiple .semi-select-content-wrapper .semi-tag-group {
        display: flex;
        align-items: center; }
      .semi-select-multiple .semi-select-content-wrapper-one-line {
        flex-wrap: nowrap; }
        .semi-select-multiple .semi-select-content-wrapper-one-line .semi-tag-group {
          flex-wrap: nowrap;
          justify-content: flex-start;
          overflow: hidden;
          flex-shrink: 0; }
    .semi-select-multiple .semi-select-inline-label-wrapper {
      flex-shrink: 0; }
  .semi-select-multiple.semi-select-large .semi-select-content-wrapper {
    min-height: 38px; }
  .semi-select-multiple.semi-select-small .semi-select-content-wrapper {
    min-height: 22px; }
  .semi-select-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    color: var(--semi-color-text-2);
    flex-shrink: 0; }
    .semi-select-arrow-empty {
      display: flex;
      width: 12px; }
  .semi-select-prefix, .semi-select-suffix {
    display: flex;
    justify-content: center;
    align-items: center; }
    .semi-select-prefix-text, .semi-select-suffix-text {
      margin: 0 12px; }
    .semi-select-prefix-icon, .semi-select-suffix-icon {
      color: var(--semi-color-text-2);
      margin: 0 8px; }
  .semi-select-suffix {
    display: flex;
    justify-content: center;
    align-items: center; }
  .semi-select-clear {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    color: var(--semi-color-text-2);
    flex-shrink: 0; }
    .semi-select-clear:hover {
      color: var(--semi-color-primary); }
  .semi-select-inset-label-wrapper {
    display: inline; }
  .semi-select-inset-label {
    margin-right: 12px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-2);
    flex-shrink: 0;
    white-space: nowrap; }
  .semi-select-create-tips {
    color: var(--semi-color-text-2);
    margin-right: 4px; }

.semi-select-with-prefix .semi-select-selection {
  margin-left: 0; }

.semi-select-single.semi-select-filterable .semi-select-content-wrapper {
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  position: relative; }

.semi-select-single.semi-select-filterable .semi-input-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: none;
  background-color: transparent; }

.semi-select-single.semi-select-filterable .semi-input-wrapper-focus {
  border: none; }

.semi-select-single.semi-select-filterable .semi-input {
  padding-left: 0;
  padding-right: 0;
  height: 100%; }

.semi-select-multiple.semi-select-filterable .semi-select-content-wrapper {
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  position: relative; }
  .semi-select-multiple.semi-select-filterable .semi-select-content-wrapper-empty .semi-input-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%; }

.semi-select-multiple.semi-select-filterable .semi-input-wrapper {
  height: 100%;
  width: 100%;
  border: none;
  background-color: transparent; }

.semi-select-multiple.semi-select-filterable .semi-input-wrapper-focus {
  border: none; }

.semi-select-multiple.semi-select-filterable .semi-input {
  padding-left: 0;
  padding-right: 0; }

.semi-select-option-list {
  overflow-x: hidden;
  overflow-y: auto; }
  .semi-select-option-list-chosen .semi-select-option-icon {
    display: flex; }

.semi-select-group {
  color: var(--semi-color-text-2);
  padding-top: 12px;
  margin-top: 4px;
  padding-bottom: 4px;
  padding-left: 32px;
  padding-right: 16px;
  font-size: 12px;
  line-height: 16px;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  cursor: default; }
  .semi-select-group:not(:nth-of-type(1)) {
    border-top: 1px solid var(--semi-color-border); }

.semi-select-loading-wrapper {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: not-allowed; }

.semi-table {
  width: 100%;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  font-size: inherit;
  display: table; }
  .semi-table-wrapper {
    zoom: 1;
    position: relative;
    clear: both;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-0);
    width: 100%; }
  .semi-table-middle .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-middle .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    padding-top: 12px;
    padding-bottom: 12px; }
  .semi-table-small .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-small .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    padding-top: 8px;
    padding-bottom: 8px; }
  .semi-table-title {
    position: relative;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 0;
    padding-right: 0; }
  .semi-table-container {
    position: relative; }
  .semi-table-header {
    overflow: hidden; }
  .semi-table-body {
    overflow: auto;
    width: 100%;
    box-sizing: border-box; }
  .semi-table-colgroup {
    display: table-column-group; }
    .semi-table-colgroup .semi-table-col {
      display: table-column; }
    .semi-table-colgroup .semi-table-column-expand, .semi-table-colgroup .semi-table-column-selection {
      width: 48px; }
  .semi-table-thead > .semi-table-row > .semi-table-row-head {
    background-color: transparent;
    color: var(--semi-color-text-2);
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid var(--semi-color-border);
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    vertical-align: middle;
    word-break: break-all;
    word-wrap: break-word;
    position: relative;
    user-select: none; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left, .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right {
      z-index: 1;
      position: sticky;
      background-color: var(--semi-color-bg-2); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left::before, .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right::before {
        background-color: transparent;
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: block;
        z-index: -1; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last {
      border-right: 1px solid var(--semi-color-border);
      box-shadow: 3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last.resizing {
        border-right: 2px solid var(--semi-color-primary); }
        .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last.resizing .react-resizable-handle:hover {
          background-color: unset; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first {
      border-left: 1px solid var(--semi-color-border);
      box-shadow: -3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first.resizing {
        border-right: 2px solid var(--semi-color-primary); }
        .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first.resizing .react-resizable-handle:hover {
          background-color: unset; }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first[x-type="column-scrollbar"] {
        box-shadow: none;
        border-left: transparent; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-column-selection {
      text-align: center; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head[colspan]:not([colspan="1"]) {
      text-align: center; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head .semi-table-header-column {
      display: inline-flex;
      align-items: center; }
  .semi-table-thead > .semi-table-row .react-resizable {
    position: relative;
    background-clip: padding-box; }
  .semi-table-thead > .semi-table-row .resizing {
    border-right: 2px solid var(--semi-color-primary); }
    .semi-table-thead > .semi-table-row .resizing .react-resizable-handle:hover {
      background-color: unset; }
  .semi-table-thead > .semi-table-row .react-resizable-handle {
    position: absolute;
    width: 9px;
    height: calc(100% - 4px * 2);
    background-color: var(--semi-color-border);
    bottom: 4px;
    right: -1px;
    cursor: col-resize;
    z-index: 0; }
    .semi-table-thead > .semi-table-row .react-resizable-handle:hover {
      background-color: var(--semi-color-primary); }
  .semi-table-tbody {
    display: table-row-group; }
    .semi-table-tbody > .semi-table-row {
      display: table-row; }
      .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell {
        background-color: var(--semi-color-fill-0); }
        .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left, .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right {
          background-color: var(--semi-color-bg-2); }
          .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left::before, .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right::before {
            background-color: var(--semi-color-fill-0);
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: block;
            z-index: -1; }
      .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
        display: table-cell;
        word-wrap: break-word;
        word-break: break-all;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid var(--semi-color-border);
        padding: 16px;
        box-sizing: border-box;
        position: relative;
        vertical-align: middle; }
        .semi-table-tbody > .semi-table-row > .semi-table-row-cell.resizing {
          border-right: 2px solid var(--semi-color-primary); }
      .semi-table-tbody > .semi-table-row.semi-table-row-expand > .semi-table-row-cell {
        background-color: var(--semi-color-fill-0); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left, .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right {
        z-index: 1;
        position: sticky;
        background-color: var(--semi-color-bg-2); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left-last {
        border-right: 1px solid var(--semi-color-border);
        box-shadow: 3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right-first {
        border-left: 1px solid var(--semi-color-border);
        box-shadow: -3px 0 0 0 var(--semi-color-shadow); }
    .semi-table-tbody > .semi-table-row-section {
      display: table-row; }
      .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell {
        background-color: rgba(var(--semi-grey-0), 1);
        border-bottom: 1px solid var(--semi-color-border); }
      .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell:not(.semi-table-column-selection) {
        padding: 10px 16px; }
      .semi-table-tbody > .semi-table-row-section .semi-table-section-inner {
        display: inline-flex;
        align-items: center; }
  .semi-table-virtualized .semi-table-tbody {
    display: block; }
    .semi-table-virtualized .semi-table-tbody > .semi-table-row {
      display: flex; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
        word-wrap: unset;
        word-break: unset;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        overflow: hidden; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell {
        padding-top: 16px;
        padding-bottom: 16px;
        display: flex; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row-expand > .semi-table-row-cell {
        padding: 0;
        overflow: unset; }
  .semi-table-footer {
    background-color: var(--semi-color-fill-0);
    padding: 16px;
    margin: 0;
    position: relative; }
  .semi-table .semi-table-selection-wrap {
    display: inline-flex;
    vertical-align: bottom; }
  .semi-table .semi-table-selection-disabled {
    cursor: not-allowed; }
    .semi-table .semi-table-selection-disabled > .semi-checkbox {
      pointer-events: none; }
  .semi-table .semi-table-column-hidden {
    display: none; }
  .semi-table .semi-table-column-selection {
    text-align: center; }
    .semi-table .semi-table-column-selection .semi-checkbox-inner-display .semi-icon {
      left: 0;
      top: 0; }
  .semi-table .semi-table-column-expand .semi-table-expand-icon {
    transform: translateY(2px); }
    .semi-table .semi-table-column-expand .semi-table-expand-icon:last-child {
      margin-right: 0; }
  .semi-table .semi-table-column-sorter {
    margin-left: 4px;
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    vertical-align: middle;
    text-align: center; }
    .semi-table .semi-table-column-sorter-up, .semi-table .semi-table-column-sorter-down {
      height: 0;
      display: block;
      color: var(--semi-color-text-2); }
      .semi-table .semi-table-column-sorter-up:hover .anticon, .semi-table .semi-table-column-sorter-down:hover .anticon {
        color: var(--semi-color-text-2); }
      .semi-table .semi-table-column-sorter-up svg, .semi-table .semi-table-column-sorter-down svg {
        width: 16px;
        height: 16px; }
      .semi-table .semi-table-column-sorter-up.on .semi-icon-caretup,
.semi-table .semi-table-column-sorter-up.on .semi-icon-caretdown, .semi-table .semi-table-column-sorter-down.on .semi-icon-caretup,
.semi-table .semi-table-column-sorter-down.on .semi-icon-caretdown {
        color: var(--semi-color-primary); }
  .semi-table .semi-table-column-filter {
    margin-left: 4px;
    display: inline-flex;
    cursor: pointer;
    color: var(--semi-color-text-2);
    vertical-align: middle; }
    .semi-table .semi-table-column-filter svg {
      width: 12px;
      height: 12px; }
    .semi-table .semi-table-column-filter.on {
      color: var(--semi-color-primary); }
  .semi-table-bordered .semi-table-title {
    padding-left: 16px;
    padding-right: 16px;
    border-top: 1px solid var(--semi-color-border);
    border-right: 1px solid var(--semi-color-border);
    border-left: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-container {
    border: 1px solid var(--semi-color-border);
    border-right: 0;
    border-bottom: 0; }
  .semi-table-bordered .semi-table-footer {
    border-left: 1px solid var(--semi-color-border);
    border-right: 1px solid var(--semi-color-border);
    border-bottom: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-thead > .semi-table-row > .semi-table-row-head .react-resizable-handle {
    background-color: transparent; }
  .semi-table-bordered .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-bordered .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    border-right: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-placeholder {
    border-right: 1px solid var(--semi-color-border); }
  .semi-table-placeholder {
    position: relative;
    z-index: 1;
    padding: 16px 12px;
    color: var(--semi-color-disabled-bg);
    font-size: 14px;
    text-align: center;
    background: transparent;
    border-bottom: 1px solid var(--semi-color-border);
    border-radius: 0 0 4px 4px; }
  .semi-table-fixed {
    table-layout: fixed; }
    .semi-table-fixed > .semi-table-tbody > .semi-table-row-expand > .semi-table-row-cell > .semi-table-expand-inner, .semi-table-fixed > .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell > .semi-table-section-inner {
      position: sticky;
      overflow: auto;
      left: 0;
      margin-left: -16px;
      margin-right: -16px;
      padding-left: 16px;
      padding-right: 16px;
      height: 100%;
      display: flex;
      align-items: center; }
  .semi-table-scroll-position-left .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left-last,
.semi-table-scroll-position-left .semi-table-thead > .semi-table-row > .semi-table-cell-fixed-left-last {
    box-shadow: none; }
  .semi-table-scroll-position-right .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right-first,
.semi-table-scroll-position-right .semi-table-thead > .semi-table-row > .semi-table-cell-fixed-right-first {
    box-shadow: none; }
  .semi-table-pagination-outer {
    color: var(--semi-color-text-2);
    min-height: 60px; }

.semi-table-expand-icon {
  color: var(--semi-color-text-2);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  user-select: none;
  background: transparent;
  position: relative;
  margin-right: 8px; }
  .semi-table-expand-icon-cell {
    display: inline-flex;
    align-items: center;
    justify-content: center; }

.semi-page {
  display: flex;
  list-style: none;
  padding: 0;
  align-items: center;
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin-block-start: 0;
  margin-block-end: 0; }
  .semi-page-small {
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400;
    color: var(--semi-color-text-2);
    padding: 0 0; }
  .semi-page-item {
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    min-width: 32px;
    border: 1px solid #BBBFC4;
    cursor: pointer;
    user-select: none;
    height: 32px;
    margin-left: 4px;
    margin-right: 4px;
    font-weight: 400;
    color: var(--semi-color-text-0);
    border-radius: var(--semi-border-radius-small);
    text-align: center;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center; }
    .semi-page-item:hover {
      border-color: #BBBFC4;
      background-color: var(--semi-color-fill-0);
      color: var(--semi-color-text-0); }
    .semi-page-item-rest-opening {
      background-color: var(--semi-color-fill-0);
      color: var(--semi-color-text-0); }
    .semi-page-item:active {
      border-color: transparent;
      background-color: var(--semi-color-fill-1);
      color: var(--semi-color-text-0); }
    .semi-page-item-active {
      border-color: var(--semi-color-primary);
      color: var(--semi-color-primary);
      font-weight: 600;
      background-color: var(--semi-color-primary-light-default); }
      .semi-page-item-active:hover {
        border-color: var(--semi-color-primary);
        color: var(--semi-color-primary);
        background-color: var(--semi-color-primary-light-default); }
    .semi-page-item-disabled {
      border-color: #BBBFC4;
      color: var(--semi-color-disabled-text);
      background-color: transparent;
      cursor: not-allowed; }
      .semi-page-item-disabled:hover {
        background-color: transparent; }
    .semi-page-item-small {
      min-width: 44px;
      margin: 0; }
  .semi-page-total {
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-2); }
  .semi-page-prev, .semi-page-next {
    color: var(--semi-color-tertiary);
    cursor: pointer; }
    .semi-page-prev.semi-page-item-disabled, .semi-page-next.semi-page-item-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed; }
  .semi-page-quickjump {
    margin-left: 24px;
    font-size: 14px;
    line-height: 20px;
    font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    color: var(--semi-color-text-0); }
    .semi-page-quickjump-input-number {
      max-width: 50px;
      margin-left: 4px;
      margin-right: 4px; }
    .semi-page-quickjump-disabled {
      color: var(--semi-color-disabled-text); }
  .semi-page .semi-select {
    user-select: none; }

.semi-select-dropdown {
  user-select: none; }

.semi-page-rest-list {
  padding-top: 4px;
  padding-bottom: 4px; }
  .semi-page-rest-list > div {
    position: relative; }

.semi-page-rest-item {
  height: 32px;
  line-height: 32px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer; }
  .semi-page-rest-item:hover {
    background-color: var(--semi-color-fill-0); }
  .semi-page-rest-item:active {
    background-color: var(--semi-color-fill-1); }
`;

export const douyinTheme = `/* shadow */
/* sizing */
/* spacing */
.semi-descriptions {
  line-height: 20px; }
  .semi-descriptions table,
.semi-descriptions tr,
.semi-descriptions th,
.semi-descriptions td {
    margin: 0;
    padding: 0;
    border: 0; }
  .semi-descriptions th {
    padding-right: 24px; }
  .semi-descriptions .semi-descriptions-item {
    margin: 0;
    padding-bottom: 12px;
    text-align: left;
    vertical-align: top; }
  .semi-descriptions-key {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    min-height: 14px;
    white-space: nowrap;
    color: var(--semi-color-text-2); }
  .semi-descriptions-value {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-0); }
  .semi-descriptions-center .semi-descriptions-item-th {
    text-align: right; }
  .semi-descriptions-center .semi-descriptions-item-td {
    text-align: left; }
  .semi-descriptions-left .semi-descriptions-item-th,
.semi-descriptions-left .semi-descriptions-item-td {
    text-align: left; }
  .semi-descriptions-justify .semi-descriptions-item-th {
    text-align: left; }
  .semi-descriptions-justify .semi-descriptions-item-td {
    text-align: right; }
  .semi-descriptions-plain .semi-descriptions-key,
.semi-descriptions-plain .semi-descriptions-value {
    display: inline-block; }
  .semi-descriptions-plain .semi-descriptions-value {
    padding-left: 8px; }
    .semi-descriptions-plain .semi-descriptions-value .semi-tag {
      vertical-align: middle; }
  .semi-descriptions-double tbody {
    display: flex;
    flex-wrap: wrap; }
  .semi-descriptions-double tr {
    display: inline-flex;
    flex-direction: column; }
  .semi-descriptions-double .semi-descriptions-item {
    padding: 0;
    flex: 1; }
  .semi-descriptions-double .semi-descriptions-value {
    font-weight: 600; }
  .semi-descriptions-double-small .semi-descriptions-item {
    padding-right: 48px; }
  .semi-descriptions-double-small .semi-descriptions-key {
    font-size: 12px;
    line-height: 16px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding-bottom: 0; }
  .semi-descriptions-double-small .semi-descriptions-value {
    font-size: 16px;
    line-height: 22px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-descriptions-double-medium .semi-descriptions-item {
    padding-right: 60px; }
  .semi-descriptions-double-medium .semi-descriptions-key {
    padding-bottom: 4px; }
  .semi-descriptions-double-medium .semi-descriptions-value {
    font-size: 21px;
    line-height: 28px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-descriptions-double-large .semi-descriptions-item {
    padding-right: 80px; }
  .semi-descriptions-double-large .semi-descriptions-key {
    padding-bottom: 4px; }
  .semi-descriptions-double-large .semi-descriptions-value {
    font-size: 28px;
    line-height: 40px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }

.semi-typography {
  color: var(--semi-color-text-0);
  font-size: 14px;
  line-height: 20px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-typography.semi-typography-secondary {
    color: var(--semi-color-text-1); }
  .semi-typography.semi-typography-tertiary {
    color: var(--semi-color-text-2); }
  .semi-typography.semi-typography-quaternary {
    color: var(--semi-color-text-3); }
  .semi-typography.semi-typography-warning {
    color: var(--semi-color-warning); }
  .semi-typography.semi-typography-success {
    color: var(--semi-color-success); }
  .semi-typography.semi-typography-danger {
    color: var(--semi-color-danger); }
  .semi-typography.semi-typography-link {
    color: var(--semi-color-link);
    font-weight: 600; }
  .semi-typography.semi-typography-disabled {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
    user-select: none; }
    .semi-typography.semi-typography-disabled.semi-typography-link {
      color: var(--semi-color-link); }
  .semi-typography-icon {
    margin-right: 4px;
    vertical-align: middle;
    color: inherit; }
  .semi-typography-small {
    font-size: 12px;
    line-height: 16px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-typography code {
    border: 1px solid var(--semi-color-border);
    border-radius: 2px;
    color: var(--semi-color-text-2);
    background-color: var(--semi-color-fill-1);
    padding: 2px 4px; }
  .semi-typography mark {
    background-color: var(--semi-color-primary-light-default); }
  .semi-typography u {
    text-decoration: underline;
    text-decoration-skip-ink: auto; }
  .semi-typography del {
    text-decoration: line-through; }
  .semi-typography strong {
    font-weight: 600; }
  .semi-typography a {
    display: inline;
    color: var(--semi-color-link);
    cursor: pointer;
    text-decoration: none; }
    .semi-typography a:visited {
      color: var(--semi-color-link-visited); }
    .semi-typography a:hover {
      color: var(--semi-color-link-hover); }
    .semi-typography a:active {
      color: var(--semi-color-link-active); }
    .semi-typography a .semi-typography-link-underline:hover {
      border-bottom: 1px solid var(--semi-color-link-hover);
      margin-bottom: -1px; }
    .semi-typography a .semi-typography-link-underline:active {
      border-bottom: 1px solid var(--semi-color-link-active);
      margin-bottom: -1px; }
  .semi-typography-ellipsis-single-line {
    overflow: hidden; }
  .semi-typography-ellipsis-multiple-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden; }
  .semi-typography-ellipsis-overflow-ellipsis {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis; }
  .semi-typography-ellipsis-expand {
    display: inline;
    margin-left: 8px; }
  .semi-typography-action-copy {
    display: inline-flex;
    vertical-align: text-bottom;
    padding: 0;
    margin-left: 4px; }
  .semi-typography a.semi-typography-action-copy-icon {
    display: inline-flex; }
  .semi-typography-action-copied {
    display: inline-flex;
    padding: 0;
    margin-left: 4px;
    color: var(--semi-color-text-2); }
    .semi-typography-action-copied .semi-icon {
      vertical-align: text-bottom;
      color: var(--semi-color-success); }
  .semi-typography-paragraph {
    margin: 0; }

h1.semi-typography,
.semi-typography-h1.semi-typography {
  font-size: 32px;
  line-height: 44px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h2.semi-typography,
.semi-typography-h2.semi-typography {
  font-size: 28px;
  line-height: 40px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h3.semi-typography,
.semi-typography-h3.semi-typography {
  font-size: 24px;
  line-height: 32px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h4.semi-typography,
.semi-typography-h4.semi-typography {
  font-size: 21px;
  line-height: 28px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h5.semi-typography,
.semi-typography-h5.semi-typography {
  font-size: 18px;
  line-height: 24px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h6.semi-typography,
.semi-typography-h6.semi-typography {
  font-size: 16px;
  line-height: 22px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

p.semi-typography-extended,
.semi-typography-paragraph.semi-typography-extended {
  line-height: 24px; }

.semi-input-textarea-wrapper {
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 100%;
  border: 1px transparent solid;
  border-radius: var(--semi-border-radius-small);
  vertical-align: bottom;
  background-color: var(--semi-color-fill-0); }
  .semi-input-textarea-wrapper:hover {
    background-color: var(--semi-color-fill-1); }
  .semi-input-textarea-wrapper-focus {
    background-color: var(--semi-color-fill-0);
    border: 1px var(--semi-color-focus-border) solid; }
    .semi-input-textarea-wrapper-focus:hover, .semi-input-textarea-wrapper-focus:active {
      background-color: var(--semi-color-fill-0); }
  .semi-input-textarea-wrapper:active {
    background-color: var(--semi-color-fill-2); }
  .semi-input-textarea-wrapper .semi-input-clearbtn {
    position: absolute;
    top: 0;
    min-width: 24px;
    color: var(--semi-color-text-2);
    right: 4px;
    height: 32px; }
    .semi-input-textarea-wrapper .semi-input-clearbtn > svg {
      pointer-events: none; }
    .semi-input-textarea-wrapper .semi-input-clearbtn:hover {
      cursor: pointer; }
      .semi-input-textarea-wrapper .semi-input-clearbtn:hover .semi-icon {
        color: var(--semi-color-primary-hover); }
    .semi-input-textarea-wrapper .semi-input-clearbtn-hidden {
      visibility: hidden; }
  .semi-input-textarea-wrapper-readonly {
    cursor: default; }
  .semi-input-textarea-wrapper-disabled {
    cursor: not-allowed;
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill); }
    .semi-input-textarea-wrapper-disabled:hover {
      background-color: var(--semi-color-disabled-fill); }
    .semi-input-textarea-wrapper-disabled::placeholder {
      color: var(--semi-color-disabled-text); }
  .semi-input-textarea-wrapper-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default); }
    .semi-input-textarea-wrapper-error:hover {
      background-color: var(--semi-color-danger-light-hover);
      border-color: var(--semi-color-danger-light-hover); }
    .semi-input-textarea-wrapper-error.semi-input-textarea-wrapper-focus {
      background-color: var(--semi-color-danger-light-default);
      border-color: var(--semi-color-danger); }
    .semi-input-textarea-wrapper-error:active {
      background-color: var(--semi-color-danger-light-active);
      border-color: var(--semi-color-danger-light-active); }
  .semi-input-textarea-wrapper-warning {
    background-color: var(--semi-color-warning-light-default);
    border-color: var(--semi-color-warning-light-default); }
    .semi-input-textarea-wrapper-warning:hover {
      background-color: var(--semi-color-warning-light-hover);
      border-color: var(--semi-color-warning-light-hover); }
    .semi-input-textarea-wrapper-warning.semi-input-textarea-wrapper-focus {
      background-color: var(--semi-color-warning-light-default);
      border-color: var(--semi-color-warning); }
    .semi-input-textarea-wrapper-warning:active {
      background-color: var(--semi-color-warning-light-active);
      border-color: var(--semi-color-warning-light-active); }

.semi-input-textarea {
  position: relative;
  resize: none;
  padding: 5px 12px;
  box-shadow: none;
  font-size: 14px;
  line-height: 20px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: transparent;
  border: 0 solid transparent;
  vertical-align: bottom;
  width: 100%;
  outline: none;
  cursor: text;
  box-sizing: border-box;
  color: var(--semi-color-text-0); }
  .semi-input-textarea::placeholder {
    color: var(--semi-color-text-2); }
  .semi-input-textarea-showClear {
    padding-right: 36px; }
  .semi-input-textarea-disabled {
    cursor: not-allowed;
    color: var(--semi-color-disabled-text);
    background-color: transparent; }
    .semi-input-textarea-disabled:hover {
      background-color: transparent; }
    .semi-input-textarea-disabled::placeholder {
      color: var(--semi-color-disabled-text); }
  .semi-input-textarea-autosize {
    overflow: hidden; }
  .semi-input-textarea-counter {
    font-size: 12px;
    line-height: 16px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3px 12px 5px 12px;
    min-height: 24px;
    text-align: right;
    color: var(--semi-color-text-2); }
    .semi-input-textarea-counter-exceed {
      color: var(--semi-color-danger); }

.semi-select {
  box-sizing: border-box;
  border-radius: var(--semi-border-radius-small);
  border: 1px solid transparent;
  height: 32px;
  font-weight: 400;
  background-color: var(--semi-color-fill-0);
  display: inline-flex;
  vertical-align: middle;
  position: relative;
  outline: none;
  cursor: pointer; }
  .semi-select:hover {
    background-color: var(--semi-color-fill-1); }
  .semi-select:active {
    background-color: var(--semi-color-fill-2); }
  .semi-select:focus {
    border: 1px solid var(--semi-color-focus-border);
    outline: 0; }
  .semi-select-small {
    height: 24px;
    line-height: 24px; }
  .semi-select-large {
    min-height: 40px;
    line-height: 40px; }
  .semi-select-open, .semi-select-focus {
    border: 1px solid var(--semi-color-focus-border);
    outline: 0; }
    .semi-select-open:hover, .semi-select-focus:hover {
      background-color: var(--semi-color-fill-0); }
  .semi-select-warning {
    background-color: var(--semi-color-warning-light-default);
    border-color: var(--semi-color-warning-light-default); }
    .semi-select-warning:hover {
      background-color: var(--semi-color-warning-light-hover);
      border-color: var(--semi-color-warning-light-hover); }
    .semi-select-warning:focus {
      background-color: var(--semi-color-warning-light-default);
      border-color: var(--semi-color-warning); }
    .semi-select-warning:active {
      background-color: var(--semi-color-warning-light-active);
      border-color: var(--semi-color-warning-light-active); }
  .semi-select-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default); }
    .semi-select-error:hover {
      background-color: var(--semi-color-danger-light-hover);
      border-color: var(--semi-color-danger-light-hover); }
    .semi-select-error:focus {
      background-color: var(--semi-color-danger-light-default);
      border-color: var(--semi-color-danger); }
    .semi-select-error:active {
      background-color: var(--semi-color-danger-light-active);
      border-color: var(--semi-color-danger-light-active); }
  .semi-select-disabled {
    cursor: not-allowed;
    background-color: var(--semi-color-disabled-fill); }
    .semi-select-disabled:hover {
      background-color: var(--semi-color-disabled-fill); }
    .semi-select-disabled:focus {
      border: 1px solid var(--semi-color-focus-border); }
    .semi-select-disabled .semi-select-selection,
.semi-select-disabled .semi-select-selection-placeholder {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed; }
    .semi-select-disabled .semi-select-arrow,
.semi-select-disabled .semi-select-prefix,
.semi-select-disabled .semi-select-suffix {
      color: var(--semi-color-disabled-text); }
    .semi-select-disabled .semi-tag {
      color: var(--semi-color-disabled-text);
      background-color: transparent; }
  .semi-select-selection {
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    height: 100%;
    display: flex;
    align-items: center;
    flex-grow: 1;
    overflow: hidden;
    margin-left: 12px;
    cursor: pointer;
    color: var(--semi-color-text-0); }
    .semi-select-selection-text {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis; }
      .semi-select-selection-text-inactive {
        display: flex;
        opacity: 0.4; }
      .semi-select-selection-text-hide {
        display: none; }
    .semi-select-selection-placeholder {
      color: var(--semi-color-text-2); }
    .semi-select-selection .semi-tag {
      margin-top: 1px;
      margin-right: 4px;
      margin-bottom: 1px; }
      .semi-select-selection .semi-tag:nth-of-type(1) {
        margin-left: 0; }
    .semi-select-selection .semi-tag-group {
      height: inherit; }
      .semi-select-selection .semi-tag-group .semi-tag {
        margin-top: 1px;
        margin-right: 4px;
        margin-bottom: 1px; }
  .semi-select-content-wrapper {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 100%; }
  .semi-select-multiple {
    height: auto; }
    .semi-select-multiple .semi-select-selection {
      margin-left: 4px; }
    .semi-select-multiple .semi-select-content-wrapper {
      width: 100%;
      min-height: 30px;
      flex-wrap: wrap; }
      .semi-select-multiple .semi-select-content-wrapper-empty {
        margin-left: 8px; }
      .semi-select-multiple .semi-select-content-wrapper .semi-tag-group {
        display: flex;
        align-items: center; }
      .semi-select-multiple .semi-select-content-wrapper-one-line {
        flex-wrap: nowrap; }
        .semi-select-multiple .semi-select-content-wrapper-one-line .semi-tag-group {
          flex-wrap: nowrap;
          justify-content: flex-start;
          overflow: hidden;
          flex-shrink: 0; }
    .semi-select-multiple .semi-select-inline-label-wrapper {
      flex-shrink: 0; }
  .semi-select-multiple.semi-select-large .semi-select-content-wrapper {
    min-height: 38px; }
  .semi-select-multiple.semi-select-small .semi-select-content-wrapper {
    min-height: 22px; }
  .semi-select-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    color: var(--semi-color-text-2);
    flex-shrink: 0; }
    .semi-select-arrow-empty {
      display: flex;
      width: 12px; }
  .semi-select-prefix, .semi-select-suffix {
    display: flex;
    justify-content: center;
    align-items: center; }
    .semi-select-prefix-text, .semi-select-suffix-text {
      margin: 0 12px; }
    .semi-select-prefix-icon, .semi-select-suffix-icon {
      color: var(--semi-color-text-2);
      margin: 0 8px; }
  .semi-select-suffix {
    display: flex;
    justify-content: center;
    align-items: center; }
  .semi-select-clear {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    color: var(--semi-color-text-2);
    flex-shrink: 0; }
    .semi-select-clear:hover {
      color: var(--semi-color-primary); }
  .semi-select-inset-label-wrapper {
    display: inline; }
  .semi-select-inset-label {
    margin-right: 12px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-2);
    flex-shrink: 0;
    white-space: nowrap; }
  .semi-select-create-tips {
    color: var(--semi-color-text-2);
    margin-right: 4px; }

.semi-select-with-prefix .semi-select-selection {
  margin-left: 0; }

.semi-select-single.semi-select-filterable .semi-select-content-wrapper {
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  position: relative; }

.semi-select-single.semi-select-filterable .semi-input-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: none;
  background-color: transparent; }

.semi-select-single.semi-select-filterable .semi-input-wrapper-focus {
  border: none; }

.semi-select-single.semi-select-filterable .semi-input {
  padding-left: 0;
  padding-right: 0;
  height: 100%; }

.semi-select-multiple.semi-select-filterable .semi-select-content-wrapper {
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  position: relative; }
  .semi-select-multiple.semi-select-filterable .semi-select-content-wrapper-empty .semi-input-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%; }

.semi-select-multiple.semi-select-filterable .semi-input-wrapper {
  height: 100%;
  width: 100%;
  border: none;
  background-color: transparent; }

.semi-select-multiple.semi-select-filterable .semi-input-wrapper-focus {
  border: none; }

.semi-select-multiple.semi-select-filterable .semi-input {
  padding-left: 0;
  padding-right: 0; }

.semi-select-option-list {
  overflow-x: hidden;
  overflow-y: auto; }
  .semi-select-option-list-chosen .semi-select-option-icon {
    display: flex; }

.semi-select-group {
  color: var(--semi-color-text-2);
  padding-top: 12px;
  margin-top: 4px;
  padding-bottom: 4px;
  padding-left: 32px;
  padding-right: 16px;
  font-size: 12px;
  line-height: 16px;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  cursor: default; }
  .semi-select-group:not(:nth-of-type(1)) {
    border-top: 1px solid var(--semi-color-border); }

.semi-select-loading-wrapper {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: not-allowed; }

.semi-table {
  width: 100%;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  font-size: inherit;
  display: table; }
  .semi-table-wrapper {
    zoom: 1;
    position: relative;
    clear: both;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-0);
    width: 100%; }
  .semi-table-middle .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-middle .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    padding-top: 12px;
    padding-bottom: 12px; }
  .semi-table-small .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-small .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    padding-top: 8px;
    padding-bottom: 8px; }
  .semi-table-title {
    position: relative;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 0;
    padding-right: 0; }
  .semi-table-container {
    position: relative; }
  .semi-table-header {
    overflow: hidden; }
  .semi-table-body {
    overflow: auto;
    width: 100%;
    box-sizing: border-box; }
  .semi-table-colgroup {
    display: table-column-group; }
    .semi-table-colgroup .semi-table-col {
      display: table-column; }
    .semi-table-colgroup .semi-table-column-expand, .semi-table-colgroup .semi-table-column-selection {
      width: 48px; }
  .semi-table-thead > .semi-table-row > .semi-table-row-head {
    background-color: var(--semi-color-bg-0);
    color: var(--semi-color-text-2);
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid var(--semi-color-border);
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    vertical-align: middle;
    word-break: break-all;
    word-wrap: break-word;
    position: relative;
    user-select: none; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left, .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right {
      z-index: 1;
      position: sticky;
      background-color: var(--semi-color-bg-2); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left::before, .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right::before {
        background-color: var(--semi-color-bg-0);
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: block;
        z-index: -1; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last {
      border-right: 1px solid var(--semi-color-border);
      box-shadow: 3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last.resizing {
        border-right: 2px solid var(--semi-color-primary); }
        .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last.resizing .react-resizable-handle:hover {
          background-color: unset; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first {
      border-left: 1px solid var(--semi-color-border);
      box-shadow: -3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first.resizing {
        border-right: 2px solid var(--semi-color-primary); }
        .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first.resizing .react-resizable-handle:hover {
          background-color: unset; }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first[x-type="column-scrollbar"] {
        box-shadow: none;
        border-left: transparent; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-column-selection {
      text-align: center; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head[colspan]:not([colspan="1"]) {
      text-align: center; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head .semi-table-header-column {
      display: inline-flex;
      align-items: center; }
  .semi-table-thead > .semi-table-row .react-resizable {
    position: relative;
    background-clip: padding-box; }
  .semi-table-thead > .semi-table-row .resizing {
    border-right: 2px solid var(--semi-color-primary); }
    .semi-table-thead > .semi-table-row .resizing .react-resizable-handle:hover {
      background-color: unset; }
  .semi-table-thead > .semi-table-row .react-resizable-handle {
    position: absolute;
    width: 9px;
    height: calc(100% - 4px * 2);
    background-color: var(--semi-color-border);
    bottom: 4px;
    right: -1px;
    cursor: col-resize;
    z-index: 0; }
    .semi-table-thead > .semi-table-row .react-resizable-handle:hover {
      background-color: var(--semi-color-primary); }
  .semi-table-tbody {
    display: table-row-group; }
    .semi-table-tbody > .semi-table-row {
      display: table-row; }
      .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell {
        background-color: var(--semi-color-fill-0); }
        .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left, .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right {
          background-color: var(--semi-color-bg-2); }
          .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left::before, .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right::before {
            background-color: var(--semi-color-fill-0);
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: block;
            z-index: -1; }
      .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
        display: table-cell;
        word-wrap: break-word;
        word-break: break-all;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid var(--semi-color-border);
        padding: 16px;
        box-sizing: border-box;
        position: relative;
        vertical-align: middle; }
        .semi-table-tbody > .semi-table-row > .semi-table-row-cell.resizing {
          border-right: 2px solid var(--semi-color-primary); }
      .semi-table-tbody > .semi-table-row.semi-table-row-expand > .semi-table-row-cell {
        background-color: var(--semi-color-fill-0); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left, .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right {
        z-index: 1;
        position: sticky;
        background-color: var(--semi-color-bg-2); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left-last {
        border-right: 1px solid var(--semi-color-border);
        box-shadow: 3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right-first {
        border-left: 1px solid var(--semi-color-border);
        box-shadow: -3px 0 0 0 var(--semi-color-shadow); }
    .semi-table-tbody > .semi-table-row-section {
      display: table-row; }
      .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell {
        background-color: rgba(var(--semi-grey-0), 1);
        border-bottom: 1px solid var(--semi-color-border); }
      .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell:not(.semi-table-column-selection) {
        padding: 10px 16px; }
      .semi-table-tbody > .semi-table-row-section .semi-table-section-inner {
        display: inline-flex;
        align-items: center; }
  .semi-table-virtualized .semi-table-tbody {
    display: block; }
    .semi-table-virtualized .semi-table-tbody > .semi-table-row {
      display: flex; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
        word-wrap: unset;
        word-break: unset;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        overflow: hidden; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell {
        padding-top: 16px;
        padding-bottom: 16px;
        display: flex; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row-expand > .semi-table-row-cell {
        padding: 0;
        overflow: unset; }
  .semi-table-footer {
    background-color: var(--semi-color-fill-0);
    padding: 16px;
    margin: 0;
    position: relative; }
  .semi-table .semi-table-selection-wrap {
    display: inline-flex;
    vertical-align: bottom; }
  .semi-table .semi-table-selection-disabled {
    cursor: not-allowed; }
    .semi-table .semi-table-selection-disabled > .semi-checkbox {
      pointer-events: none; }
  .semi-table .semi-table-column-hidden {
    display: none; }
  .semi-table .semi-table-column-selection {
    text-align: center; }
    .semi-table .semi-table-column-selection .semi-checkbox-inner-display .semi-icon {
      left: 0;
      top: 0; }
  .semi-table .semi-table-column-expand .semi-table-expand-icon {
    transform: translateY(2px); }
    .semi-table .semi-table-column-expand .semi-table-expand-icon:last-child {
      margin-right: 0; }
  .semi-table .semi-table-column-sorter {
    margin-left: 4px;
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    vertical-align: middle;
    text-align: center; }
    .semi-table .semi-table-column-sorter-up, .semi-table .semi-table-column-sorter-down {
      height: 0;
      display: block;
      color: var(--semi-color-text-2); }
      .semi-table .semi-table-column-sorter-up:hover .anticon, .semi-table .semi-table-column-sorter-down:hover .anticon {
        color: var(--semi-color-text-2); }
      .semi-table .semi-table-column-sorter-up svg, .semi-table .semi-table-column-sorter-down svg {
        width: 16px;
        height: 16px; }
      .semi-table .semi-table-column-sorter-up.on .semi-icon-caretup,
.semi-table .semi-table-column-sorter-up.on .semi-icon-caretdown, .semi-table .semi-table-column-sorter-down.on .semi-icon-caretup,
.semi-table .semi-table-column-sorter-down.on .semi-icon-caretdown {
        color: var(--semi-color-primary); }
  .semi-table .semi-table-column-filter {
    margin-left: 4px;
    display: inline-flex;
    cursor: pointer;
    color: var(--semi-color-text-2);
    vertical-align: middle; }
    .semi-table .semi-table-column-filter svg {
      width: 12px;
      height: 12px; }
    .semi-table .semi-table-column-filter.on {
      color: var(--semi-color-primary); }
  .semi-table-bordered .semi-table-title {
    padding-left: 16px;
    padding-right: 16px;
    border-top: 1px solid var(--semi-color-border);
    border-right: 1px solid var(--semi-color-border);
    border-left: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-container {
    border: 1px solid var(--semi-color-border);
    border-right: 0;
    border-bottom: 0; }
  .semi-table-bordered .semi-table-footer {
    border-left: 1px solid var(--semi-color-border);
    border-right: 1px solid var(--semi-color-border);
    border-bottom: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-thead > .semi-table-row > .semi-table-row-head .react-resizable-handle {
    background-color: transparent; }
  .semi-table-bordered .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-bordered .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    border-right: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-placeholder {
    border-right: 1px solid var(--semi-color-border); }
  .semi-table-placeholder {
    position: relative;
    z-index: 1;
    padding: 16px 12px;
    color: var(--semi-color-disabled-bg);
    font-size: 14px;
    text-align: center;
    background: transparent;
    border-bottom: 1px solid var(--semi-color-border);
    border-radius: 0 0 4px 4px; }
  .semi-table-fixed {
    table-layout: fixed; }
    .semi-table-fixed > .semi-table-tbody > .semi-table-row-expand > .semi-table-row-cell > .semi-table-expand-inner, .semi-table-fixed > .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell > .semi-table-section-inner {
      position: sticky;
      overflow: auto;
      left: 0;
      margin-left: -16px;
      margin-right: -16px;
      padding-left: 16px;
      padding-right: 16px;
      height: 100%;
      display: flex;
      align-items: center; }
  .semi-table-scroll-position-left .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left-last,
.semi-table-scroll-position-left .semi-table-thead > .semi-table-row > .semi-table-cell-fixed-left-last {
    box-shadow: none; }
  .semi-table-scroll-position-right .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right-first,
.semi-table-scroll-position-right .semi-table-thead > .semi-table-row > .semi-table-cell-fixed-right-first {
    box-shadow: none; }
  .semi-table-pagination-outer {
    color: var(--semi-color-text-2);
    min-height: 60px; }

.semi-table-expand-icon {
  color: var(--semi-color-text-2);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  user-select: none;
  background: transparent;
  position: relative;
  margin-right: 8px; }
  .semi-table-expand-icon-cell {
    display: inline-flex;
    align-items: center;
    justify-content: center; }

.semi-page {
  display: flex;
  list-style: none;
  padding: 0;
  align-items: center;
  font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin-block-start: 0;
  margin-block-end: 0; }
  .semi-page-small {
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400;
    color: var(--semi-color-text-2);
    padding: 0 0; }
  .semi-page-item {
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    min-width: 32px;
    border: 0px solid transparent;
    cursor: pointer;
    user-select: none;
    height: 32px;
    margin-left: 4px;
    margin-right: 4px;
    font-weight: 400;
    color: var(--semi-color-text-0);
    border-radius: var(--semi-border-radius-small);
    text-align: center;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center; }
    .semi-page-item:hover {
      border-color: transparent;
      background-color: var(--semi-color-fill-0);
      color: var(--semi-color-text-0); }
    .semi-page-item-rest-opening {
      background-color: var(--semi-color-fill-0);
      color: var(--semi-color-text-0); }
    .semi-page-item:active {
      border-color: transparent;
      background-color: var(--semi-color-fill-1);
      color: var(--semi-color-text-0); }
    .semi-page-item-active {
      border-color: transparent;
      color: #fff;
      font-weight: 600;
      background-color: #FE2C55; }
      .semi-page-item-active:hover {
        border-color: transparent;
        color: #fff;
        background-color: #FE2C55; }
    .semi-page-item-disabled {
      border-color: transparent;
      color: var(--semi-color-disabled-text);
      background-color: transparent;
      cursor: not-allowed; }
      .semi-page-item-disabled:hover {
        background-color: transparent; }
    .semi-page-item-small {
      min-width: 44px;
      margin: 0; }
  .semi-page-total {
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-2); }
  .semi-page-prev, .semi-page-next {
    color: var(--semi-color-tertiary);
    cursor: pointer; }
    .semi-page-prev.semi-page-item-disabled, .semi-page-next.semi-page-item-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed; }
  .semi-page-quickjump {
    margin-left: 24px;
    font-size: 14px;
    line-height: 20px;
    font-family: "VVE-Giallo", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    color: var(--semi-color-text-0); }
    .semi-page-quickjump-input-number {
      max-width: 50px;
      margin-left: 4px;
      margin-right: 4px; }
    .semi-page-quickjump-disabled {
      color: var(--semi-color-disabled-text); }
  .semi-page .semi-select {
    user-select: none; }

.semi-select-dropdown {
  user-select: none; }

.semi-page-rest-list {
  padding-top: 4px;
  padding-bottom: 4px; }
  .semi-page-rest-list > div {
    position: relative; }

.semi-page-rest-item {
  height: 32px;
  line-height: 32px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer; }
  .semi-page-rest-item:hover {
    background-color: var(--semi-color-fill-0); }
  .semi-page-rest-item:active {
    background-color: var(--semi-color-fill-1); }
`;

export const huoshanTheme = `/* shadow */
/* sizing */
/* spacing */
.semi-descriptions {
  line-height: 20px; }
  .semi-descriptions table,
.semi-descriptions tr,
.semi-descriptions th,
.semi-descriptions td {
    margin: 0;
    padding: 0;
    border: 0; }
  .semi-descriptions th {
    padding-right: 24px; }
  .semi-descriptions .semi-descriptions-item {
    margin: 0;
    padding-bottom: 12px;
    text-align: left;
    vertical-align: top; }
  .semi-descriptions-key {
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    min-height: 12px;
    white-space: nowrap;
    color: var(--semi-color-text-2); }
  .semi-descriptions-value {
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-0); }
  .semi-descriptions-center .semi-descriptions-item-th {
    text-align: right; }
  .semi-descriptions-center .semi-descriptions-item-td {
    text-align: left; }
  .semi-descriptions-left .semi-descriptions-item-th,
.semi-descriptions-left .semi-descriptions-item-td {
    text-align: left; }
  .semi-descriptions-justify .semi-descriptions-item-th {
    text-align: left; }
  .semi-descriptions-justify .semi-descriptions-item-td {
    text-align: right; }
  .semi-descriptions-plain .semi-descriptions-key,
.semi-descriptions-plain .semi-descriptions-value {
    display: inline-block; }
  .semi-descriptions-plain .semi-descriptions-value {
    padding-left: 8px; }
    .semi-descriptions-plain .semi-descriptions-value .semi-tag {
      vertical-align: middle; }
  .semi-descriptions-double tbody {
    display: flex;
    flex-wrap: wrap; }
  .semi-descriptions-double tr {
    display: inline-flex;
    flex-direction: column; }
  .semi-descriptions-double .semi-descriptions-item {
    padding: 0;
    flex: 1; }
  .semi-descriptions-double .semi-descriptions-value {
    font-weight: 600; }
  .semi-descriptions-double-small .semi-descriptions-item {
    padding-right: 48px; }
  .semi-descriptions-double-small .semi-descriptions-key {
    font-size: 12px;
    line-height: 16px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding-bottom: 0; }
  .semi-descriptions-double-small .semi-descriptions-value {
    font-size: 16px;
    line-height: 22px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-descriptions-double-medium .semi-descriptions-item {
    padding-right: 60px; }
  .semi-descriptions-double-medium .semi-descriptions-key {
    padding-bottom: 4px; }
  .semi-descriptions-double-medium .semi-descriptions-value {
    font-size: 28px;
    line-height: 28px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-descriptions-double-large .semi-descriptions-item {
    padding-right: 80px; }
  .semi-descriptions-double-large .semi-descriptions-key {
    padding-bottom: 4px; }
  .semi-descriptions-double-large .semi-descriptions-value {
    font-size: 28px;
    line-height: 40px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }

.semi-typography {
  color: var(--semi-color-text-0);
  font-size: 12px;
  line-height: 20px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-typography.semi-typography-secondary {
    color: var(--semi-color-text-1); }
  .semi-typography.semi-typography-tertiary {
    color: var(--semi-color-text-2); }
  .semi-typography.semi-typography-quaternary {
    color: var(--semi-color-text-3); }
  .semi-typography.semi-typography-warning {
    color: var(--semi-color-warning); }
  .semi-typography.semi-typography-success {
    color: var(--semi-color-success); }
  .semi-typography.semi-typography-danger {
    color: var(--semi-color-danger); }
  .semi-typography.semi-typography-link {
    color: var(--semi-color-link);
    font-weight: 600; }
  .semi-typography.semi-typography-disabled {
    color: var(--semi-color-disabled-text);
    cursor: not-allowed;
    user-select: none; }
    .semi-typography.semi-typography-disabled.semi-typography-link {
      color: var(--semi-color-link); }
  .semi-typography-icon {
    margin-right: 4px;
    vertical-align: middle;
    color: inherit; }
  .semi-typography-small {
    font-size: 12px;
    line-height: 16px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif; }
  .semi-typography code {
    border: 1px solid var(--semi-color-border);
    border-radius: 2px;
    color: var(--semi-color-text-2);
    background-color: var(--semi-color-fill-1);
    padding: 2px 4px; }
  .semi-typography mark {
    background-color: var(--semi-color-primary-light-default); }
  .semi-typography u {
    text-decoration: underline;
    text-decoration-skip-ink: auto; }
  .semi-typography del {
    text-decoration: line-through; }
  .semi-typography strong {
    font-weight: 600; }
  .semi-typography a {
    display: inline;
    color: var(--semi-color-link);
    cursor: pointer;
    text-decoration: none; }
    .semi-typography a:visited {
      color: var(--semi-color-link-visited); }
    .semi-typography a:hover {
      color: var(--semi-color-link-hover); }
    .semi-typography a:active {
      color: var(--semi-color-link-active); }
    .semi-typography a .semi-typography-link-underline:hover {
      border-bottom: 1px solid var(--semi-color-link-hover);
      margin-bottom: -1px; }
    .semi-typography a .semi-typography-link-underline:active {
      border-bottom: 1px solid var(--semi-color-link-active);
      margin-bottom: -1px; }
  .semi-typography-ellipsis-single-line {
    overflow: hidden; }
  .semi-typography-ellipsis-multiple-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden; }
  .semi-typography-ellipsis-overflow-ellipsis {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis; }
  .semi-typography-ellipsis-expand {
    display: inline;
    margin-left: 8px; }
  .semi-typography-action-copy {
    display: inline-flex;
    vertical-align: text-bottom;
    padding: 0;
    margin-left: 4px; }
  .semi-typography a.semi-typography-action-copy-icon {
    display: inline-flex; }
  .semi-typography-action-copied {
    display: inline-flex;
    padding: 0;
    margin-left: 4px;
    color: var(--semi-color-text-2); }
    .semi-typography-action-copied .semi-icon {
      vertical-align: text-bottom;
      color: var(--semi-color-success); }
  .semi-typography-paragraph {
    margin: 0; }

h1.semi-typography,
.semi-typography-h1.semi-typography {
  font-size: 32px;
  line-height: 44px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h2.semi-typography,
.semi-typography-h2.semi-typography {
  font-size: 28px;
  line-height: 40px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h3.semi-typography,
.semi-typography-h3.semi-typography {
  font-size: 24px;
  line-height: 32px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h4.semi-typography,
.semi-typography-h4.semi-typography {
  font-size: 28px;
  line-height: 28px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h5.semi-typography,
.semi-typography-h5.semi-typography {
  font-size: 18px;
  line-height: 24px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

h6.semi-typography,
.semi-typography-h6.semi-typography {
  font-size: 16px;
  line-height: 22px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  margin: 0; }

p.semi-typography-extended,
.semi-typography-paragraph.semi-typography-extended {
  line-height: 24px; }

.semi-input-textarea-wrapper {
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 100%;
  border: 1px transparent solid;
  border-radius: var(--semi-border-radius-small);
  vertical-align: bottom;
  background-color: var(--semi-color-fill-0); }
  .semi-input-textarea-wrapper:hover {
    background-color: var(--semi-color-fill-1); }
  .semi-input-textarea-wrapper-focus {
    background-color: var(--semi-color-bg-0);
    border: 1px var(--semi-color-focus-border) solid; }
    .semi-input-textarea-wrapper-focus:hover, .semi-input-textarea-wrapper-focus:active {
      background-color: var(--semi-color-bg-0); }
  .semi-input-textarea-wrapper:active {
    background-color: var(--semi-color-bg-0); }
  .semi-input-textarea-wrapper .semi-input-clearbtn {
    position: absolute;
    top: 0;
    min-width: 24px;
    color: var(--semi-color-text-2);
    right: 4px;
    height: 32px; }
    .semi-input-textarea-wrapper .semi-input-clearbtn > svg {
      pointer-events: none; }
    .semi-input-textarea-wrapper .semi-input-clearbtn:hover {
      cursor: pointer; }
      .semi-input-textarea-wrapper .semi-input-clearbtn:hover .semi-icon {
        color: var(--semi-color-primary-hover); }
    .semi-input-textarea-wrapper .semi-input-clearbtn-hidden {
      visibility: hidden; }
  .semi-input-textarea-wrapper-readonly {
    cursor: default; }
  .semi-input-textarea-wrapper-disabled {
    cursor: not-allowed;
    color: var(--semi-color-disabled-text);
    background-color: var(--semi-color-disabled-fill); }
    .semi-input-textarea-wrapper-disabled:hover {
      background-color: var(--semi-color-disabled-fill); }
    .semi-input-textarea-wrapper-disabled::placeholder {
      color: var(--semi-color-disabled-text); }
  .semi-input-textarea-wrapper-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default); }
    .semi-input-textarea-wrapper-error:hover {
      background-color: var(--semi-color-danger-light-hover);
      border-color: var(--semi-color-danger-light-hover); }
    .semi-input-textarea-wrapper-error.semi-input-textarea-wrapper-focus {
      background-color: var(--semi-color-danger-light-default);
      border-color: var(--semi-color-danger); }
    .semi-input-textarea-wrapper-error:active {
      background-color: var(--semi-color-danger-light-active);
      border-color: var(--semi-color-danger-light-active); }
  .semi-input-textarea-wrapper-warning {
    background-color: var(--semi-color-warning-light-default);
    border-color: var(--semi-color-warning-light-default); }
    .semi-input-textarea-wrapper-warning:hover {
      background-color: var(--semi-color-warning-light-hover);
      border-color: var(--semi-color-warning-light-hover); }
    .semi-input-textarea-wrapper-warning.semi-input-textarea-wrapper-focus {
      background-color: var(--semi-color-warning-light-default);
      border-color: var(--semi-color-warning); }
    .semi-input-textarea-wrapper-warning:active {
      background-color: var(--semi-color-warning-light-active);
      border-color: var(--semi-color-warning-light-active); }

.semi-input-textarea {
  position: relative;
  resize: none;
  padding: 5px 12px;
  box-shadow: none;
  font-size: 12px;
  line-height: 20px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: transparent;
  border: 0 solid transparent;
  vertical-align: bottom;
  width: 100%;
  outline: none;
  cursor: text;
  box-sizing: border-box;
  color: var(--semi-color-text-0); }
  .semi-input-textarea::placeholder {
    color: var(--semi-color-text-2); }
  .semi-input-textarea-showClear {
    padding-right: 36px; }
  .semi-input-textarea-disabled {
    cursor: not-allowed;
    color: var(--semi-color-disabled-text);
    background-color: transparent; }
    .semi-input-textarea-disabled:hover {
      background-color: transparent; }
    .semi-input-textarea-disabled::placeholder {
      color: var(--semi-color-disabled-text); }
  .semi-input-textarea-autosize {
    overflow: hidden; }
  .semi-input-textarea-counter {
    font-size: 12px;
    line-height: 16px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3px 12px 5px 12px;
    min-height: 24px;
    text-align: right;
    color: var(--semi-color-text-2); }
    .semi-input-textarea-counter-exceed {
      color: var(--semi-color-danger); }

.semi-select {
  box-sizing: border-box;
  border-radius: var(--semi-border-radius-small);
  border: 1px solid transparent;
  height: 32px;
  font-weight: 400;
  background-color: var(--semi-color-fill-0);
  display: inline-flex;
  vertical-align: middle;
  position: relative;
  outline: none;
  cursor: pointer; }
  .semi-select:hover {
    background-color: var(--semi-color-fill-1); }
  .semi-select:active {
    background-color: var(--semi-color-fill-2); }
  .semi-select:focus {
    border: 1px solid var(--semi-color-focus-border);
    outline: 0; }
  .semi-select-small {
    height: 24px;
    line-height: 24px; }
  .semi-select-large {
    min-height: 40px;
    line-height: 40px; }
  .semi-select-open, .semi-select-focus {
    border: 1px solid var(--semi-color-focus-border);
    outline: 0; }
    .semi-select-open:hover, .semi-select-focus:hover {
      background-color: var(--semi-color-fill-0); }
  .semi-select-warning {
    background-color: var(--semi-color-warning-light-default);
    border-color: var(--semi-color-warning-light-default); }
    .semi-select-warning:hover {
      background-color: var(--semi-color-warning-light-hover);
      border-color: var(--semi-color-warning-light-hover); }
    .semi-select-warning:focus {
      background-color: var(--semi-color-warning-light-default);
      border-color: var(--semi-color-warning); }
    .semi-select-warning:active {
      background-color: var(--semi-color-warning-light-active);
      border-color: var(--semi-color-warning-light-active); }
  .semi-select-error {
    background-color: var(--semi-color-danger-light-default);
    border-color: var(--semi-color-danger-light-default); }
    .semi-select-error:hover {
      background-color: var(--semi-color-danger-light-hover);
      border-color: var(--semi-color-danger-light-hover); }
    .semi-select-error:focus {
      background-color: var(--semi-color-danger-light-default);
      border-color: var(--semi-color-danger); }
    .semi-select-error:active {
      background-color: var(--semi-color-danger-light-active);
      border-color: var(--semi-color-danger-light-active); }
  .semi-select-disabled {
    cursor: not-allowed;
    background-color: var(--semi-color-disabled-fill); }
    .semi-select-disabled:hover {
      background-color: var(--semi-color-disabled-fill); }
    .semi-select-disabled:focus {
      border: 1px solid var(--semi-color-focus-border); }
    .semi-select-disabled .semi-select-selection,
.semi-select-disabled .semi-select-selection-placeholder {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed; }
    .semi-select-disabled .semi-select-arrow,
.semi-select-disabled .semi-select-prefix,
.semi-select-disabled .semi-select-suffix {
      color: var(--semi-color-disabled-text); }
    .semi-select-disabled .semi-tag {
      color: var(--semi-color-disabled-text);
      background-color: transparent; }
  .semi-select-selection {
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    height: 100%;
    display: flex;
    align-items: center;
    flex-grow: 1;
    overflow: hidden;
    margin-left: 12px;
    cursor: pointer;
    color: var(--semi-color-text-0); }
    .semi-select-selection-text {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis; }
      .semi-select-selection-text-inactive {
        display: flex;
        opacity: 0.4; }
      .semi-select-selection-text-hide {
        display: none; }
    .semi-select-selection-placeholder {
      color: var(--semi-color-text-2); }
    .semi-select-selection .semi-tag {
      margin-top: 1px;
      margin-right: 4px;
      margin-bottom: 1px; }
      .semi-select-selection .semi-tag:nth-of-type(1) {
        margin-left: 0; }
    .semi-select-selection .semi-tag-group {
      height: inherit; }
      .semi-select-selection .semi-tag-group .semi-tag {
        margin-top: 1px;
        margin-right: 4px;
        margin-bottom: 1px; }
  .semi-select-content-wrapper {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 100%; }
  .semi-select-multiple {
    height: auto; }
    .semi-select-multiple .semi-select-selection {
      margin-left: 4px; }
    .semi-select-multiple .semi-select-content-wrapper {
      width: 100%;
      min-height: 30px;
      flex-wrap: wrap; }
      .semi-select-multiple .semi-select-content-wrapper-empty {
        margin-left: 8px; }
      .semi-select-multiple .semi-select-content-wrapper .semi-tag-group {
        display: flex;
        align-items: center; }
      .semi-select-multiple .semi-select-content-wrapper-one-line {
        flex-wrap: nowrap; }
        .semi-select-multiple .semi-select-content-wrapper-one-line .semi-tag-group {
          flex-wrap: nowrap;
          justify-content: flex-start;
          overflow: hidden;
          flex-shrink: 0; }
    .semi-select-multiple .semi-select-inline-label-wrapper {
      flex-shrink: 0; }
  .semi-select-multiple.semi-select-large .semi-select-content-wrapper {
    min-height: 38px; }
  .semi-select-multiple.semi-select-small .semi-select-content-wrapper {
    min-height: 22px; }
  .semi-select-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    color: var(--semi-color-text-2);
    flex-shrink: 0; }
    .semi-select-arrow-empty {
      display: flex;
      width: 12px; }
  .semi-select-prefix, .semi-select-suffix {
    display: flex;
    justify-content: center;
    align-items: center; }
    .semi-select-prefix-text, .semi-select-suffix-text {
      margin: 0 12px; }
    .semi-select-prefix-icon, .semi-select-suffix-icon {
      color: var(--semi-color-text-2);
      margin: 0 8px; }
  .semi-select-suffix {
    display: flex;
    justify-content: center;
    align-items: center; }
  .semi-select-clear {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    color: var(--semi-color-text-2);
    flex-shrink: 0; }
    .semi-select-clear:hover {
      color: var(--semi-color-primary); }
  .semi-select-inset-label-wrapper {
    display: inline; }
  .semi-select-inset-label {
    margin-right: 12px;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-2);
    flex-shrink: 0;
    white-space: nowrap; }
  .semi-select-create-tips {
    color: var(--semi-color-text-2);
    margin-right: 4px; }

.semi-select-with-prefix .semi-select-selection {
  margin-left: 0; }

.semi-select-single.semi-select-filterable .semi-select-content-wrapper {
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  position: relative; }

.semi-select-single.semi-select-filterable .semi-input-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: none;
  background-color: transparent; }

.semi-select-single.semi-select-filterable .semi-input-wrapper-focus {
  border: none; }

.semi-select-single.semi-select-filterable .semi-input {
  padding-left: 0;
  padding-right: 0;
  height: 100%; }

.semi-select-multiple.semi-select-filterable .semi-select-content-wrapper {
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  position: relative; }
  .semi-select-multiple.semi-select-filterable .semi-select-content-wrapper-empty .semi-input-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%; }

.semi-select-multiple.semi-select-filterable .semi-input-wrapper {
  height: 100%;
  width: 100%;
  border: none;
  background-color: transparent; }

.semi-select-multiple.semi-select-filterable .semi-input-wrapper-focus {
  border: none; }

.semi-select-multiple.semi-select-filterable .semi-input {
  padding-left: 0;
  padding-right: 0; }

.semi-select-option-list {
  overflow-x: hidden;
  overflow-y: auto; }
  .semi-select-option-list-chosen .semi-select-option-icon {
    display: flex; }

.semi-select-group {
  color: var(--semi-color-text-2);
  padding-top: 12px;
  margin-top: 4px;
  padding-bottom: 4px;
  padding-left: 32px;
  padding-right: 16px;
  font-size: 12px;
  line-height: 16px;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  cursor: default; }
  .semi-select-group:not(:nth-of-type(1)) {
    border-top: 1px solid var(--semi-color-border); }

.semi-select-loading-wrapper {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: not-allowed; }

.semi-table {
  width: 100%;
  text-align: left;
  border-collapse: separate;
  border-spacing: 0;
  font-size: inherit;
  display: table; }
  .semi-table-wrapper {
    zoom: 1;
    position: relative;
    clear: both;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-0);
    width: 100%; }
  .semi-table-middle .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-middle .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    padding-top: 12px;
    padding-bottom: 12px; }
  .semi-table-small .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-small .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    padding-top: 8px;
    padding-bottom: 8px; }
  .semi-table-title {
    position: relative;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 0;
    padding-right: 0; }
  .semi-table-container {
    position: relative; }
  .semi-table-header {
    overflow: hidden; }
  .semi-table-body {
    overflow: auto;
    width: 100%;
    box-sizing: border-box; }
  .semi-table-colgroup {
    display: table-column-group; }
    .semi-table-colgroup .semi-table-col {
      display: table-column; }
    .semi-table-colgroup .semi-table-column-expand, .semi-table-colgroup .semi-table-column-selection {
      width: 48px; }
  .semi-table-thead > .semi-table-row > .semi-table-row-head {
    background-color: transparent;
    color: var(--semi-color-text-2);
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid var(--semi-color-border);
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;
    vertical-align: middle;
    word-break: break-all;
    word-wrap: break-word;
    position: relative;
    user-select: none; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left, .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right {
      z-index: 1;
      position: sticky;
      background-color: var(--semi-color-bg-2); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left::before, .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right::before {
        background-color: transparent;
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: block;
        z-index: -1; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last {
      border-right: 1px solid var(--semi-color-border);
      box-shadow: 3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last.resizing {
        border-right: 2px solid var(--semi-color-primary); }
        .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-left-last.resizing .react-resizable-handle:hover {
          background-color: unset; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first {
      border-left: 1px solid var(--semi-color-border);
      box-shadow: -3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first.resizing {
        border-right: 2px solid var(--semi-color-primary); }
        .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first.resizing .react-resizable-handle:hover {
          background-color: unset; }
      .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-cell-fixed-right-first[x-type="column-scrollbar"] {
        box-shadow: none;
        border-left: transparent; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head.semi-table-column-selection {
      text-align: center; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head[colspan]:not([colspan="1"]) {
      text-align: center; }
    .semi-table-thead > .semi-table-row > .semi-table-row-head .semi-table-header-column {
      display: inline-flex;
      align-items: center; }
  .semi-table-thead > .semi-table-row .react-resizable {
    position: relative;
    background-clip: padding-box; }
  .semi-table-thead > .semi-table-row .resizing {
    border-right: 2px solid var(--semi-color-primary); }
    .semi-table-thead > .semi-table-row .resizing .react-resizable-handle:hover {
      background-color: unset; }
  .semi-table-thead > .semi-table-row .react-resizable-handle {
    position: absolute;
    width: 9px;
    height: calc(100% - 4px * 2);
    background-color: var(--semi-color-border);
    bottom: 4px;
    right: -1px;
    cursor: col-resize;
    z-index: 0; }
    .semi-table-thead > .semi-table-row .react-resizable-handle:hover {
      background-color: var(--semi-color-primary); }
  .semi-table-tbody {
    display: table-row-group; }
    .semi-table-tbody > .semi-table-row {
      display: table-row; }
      .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell {
        background-color: var(--semi-color-fill-0); }
        .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left, .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right {
          background-color: var(--semi-color-bg-2); }
          .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left::before, .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right::before {
            background-color: var(--semi-color-fill-0);
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: block;
            z-index: -1; }
      .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
        display: table-cell;
        word-wrap: break-word;
        word-break: break-all;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid var(--semi-color-border);
        padding: 16px;
        box-sizing: border-box;
        position: relative;
        vertical-align: middle; }
        .semi-table-tbody > .semi-table-row > .semi-table-row-cell.resizing {
          border-right: 2px solid var(--semi-color-primary); }
      .semi-table-tbody > .semi-table-row.semi-table-row-expand > .semi-table-row-cell {
        background-color: var(--semi-color-fill-0); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left, .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right {
        z-index: 1;
        position: sticky;
        background-color: var(--semi-color-bg-2); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left-last {
        border-right: 1px solid var(--semi-color-border);
        box-shadow: 3px 0 0 0 var(--semi-color-shadow); }
      .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right-first {
        border-left: 1px solid var(--semi-color-border);
        box-shadow: -3px 0 0 0 var(--semi-color-shadow); }
    .semi-table-tbody > .semi-table-row-section {
      display: table-row; }
      .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell {
        background-color: rgba(var(--semi-grey-0), 1);
        border-bottom: 1px solid var(--semi-color-border); }
      .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell:not(.semi-table-column-selection) {
        padding: 10px 16px; }
      .semi-table-tbody > .semi-table-row-section .semi-table-section-inner {
        display: inline-flex;
        align-items: center; }
  .semi-table-virtualized .semi-table-tbody {
    display: block; }
    .semi-table-virtualized .semi-table-tbody > .semi-table-row {
      display: flex; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
        word-wrap: unset;
        word-break: unset;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        overflow: hidden; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell {
        padding-top: 16px;
        padding-bottom: 16px;
        display: flex; }
      .semi-table-virtualized .semi-table-tbody > .semi-table-row-expand > .semi-table-row-cell {
        padding: 0;
        overflow: unset; }
  .semi-table-footer {
    background-color: var(--semi-color-fill-0);
    padding: 16px;
    margin: 0;
    position: relative; }
  .semi-table .semi-table-selection-wrap {
    display: inline-flex;
    vertical-align: bottom; }
  .semi-table .semi-table-selection-disabled {
    cursor: not-allowed; }
    .semi-table .semi-table-selection-disabled > .semi-checkbox {
      pointer-events: none; }
  .semi-table .semi-table-column-hidden {
    display: none; }
  .semi-table .semi-table-column-selection {
    text-align: center; }
    .semi-table .semi-table-column-selection .semi-checkbox-inner-display .semi-icon {
      left: 0;
      top: 0; }
  .semi-table .semi-table-column-expand .semi-table-expand-icon {
    transform: translateY(2px); }
    .semi-table .semi-table-column-expand .semi-table-expand-icon:last-child {
      margin-right: 0; }
  .semi-table .semi-table-column-sorter {
    margin-left: 4px;
    display: inline-block;
    width: 16px;
    height: 16px;
    cursor: pointer;
    vertical-align: middle;
    text-align: center; }
    .semi-table .semi-table-column-sorter-up, .semi-table .semi-table-column-sorter-down {
      height: 0;
      display: block;
      color: var(--semi-color-text-2); }
      .semi-table .semi-table-column-sorter-up:hover .anticon, .semi-table .semi-table-column-sorter-down:hover .anticon {
        color: var(--semi-color-text-2); }
      .semi-table .semi-table-column-sorter-up svg, .semi-table .semi-table-column-sorter-down svg {
        width: 16px;
        height: 16px; }
      .semi-table .semi-table-column-sorter-up.on .semi-icon-caretup,
.semi-table .semi-table-column-sorter-up.on .semi-icon-caretdown, .semi-table .semi-table-column-sorter-down.on .semi-icon-caretup,
.semi-table .semi-table-column-sorter-down.on .semi-icon-caretdown {
        color: var(--semi-color-primary); }
  .semi-table .semi-table-column-filter {
    margin-left: 4px;
    display: inline-flex;
    cursor: pointer;
    color: var(--semi-color-text-2);
    vertical-align: middle; }
    .semi-table .semi-table-column-filter svg {
      width: 12px;
      height: 12px; }
    .semi-table .semi-table-column-filter.on {
      color: var(--semi-color-primary); }
  .semi-table-bordered .semi-table-title {
    padding-left: 16px;
    padding-right: 16px;
    border-top: 1px solid var(--semi-color-border);
    border-right: 1px solid var(--semi-color-border);
    border-left: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-container {
    border: 1px solid var(--semi-color-border);
    border-right: 0;
    border-bottom: 0; }
  .semi-table-bordered .semi-table-footer {
    border-left: 1px solid var(--semi-color-border);
    border-right: 1px solid var(--semi-color-border);
    border-bottom: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-thead > .semi-table-row > .semi-table-row-head .react-resizable-handle {
    background-color: transparent; }
  .semi-table-bordered .semi-table-thead > .semi-table-row > .semi-table-row-head,
.semi-table-bordered .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    border-right: 1px solid var(--semi-color-border); }
  .semi-table-bordered .semi-table-placeholder {
    border-right: 1px solid var(--semi-color-border); }
  .semi-table-placeholder {
    position: relative;
    z-index: 1;
    padding: 16px 12px;
    color: var(--semi-color-disabled-bg);
    font-size: 14px;
    text-align: center;
    background: transparent;
    border-bottom: 1px solid var(--semi-color-border);
    border-radius: 0 0 4px 4px; }
  .semi-table-fixed {
    table-layout: fixed; }
    .semi-table-fixed > .semi-table-tbody > .semi-table-row-expand > .semi-table-row-cell > .semi-table-expand-inner, .semi-table-fixed > .semi-table-tbody > .semi-table-row-section > .semi-table-row-cell > .semi-table-section-inner {
      position: sticky;
      overflow: auto;
      left: 0;
      margin-left: -16px;
      margin-right: -16px;
      padding-left: 16px;
      padding-right: 16px;
      height: 100%;
      display: flex;
      align-items: center; }
  .semi-table-scroll-position-left .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-left-last,
.semi-table-scroll-position-left .semi-table-thead > .semi-table-row > .semi-table-cell-fixed-left-last {
    box-shadow: none; }
  .semi-table-scroll-position-right .semi-table-tbody > .semi-table-row > .semi-table-cell-fixed-right-first,
.semi-table-scroll-position-right .semi-table-thead > .semi-table-row > .semi-table-cell-fixed-right-first {
    box-shadow: none; }
  .semi-table-pagination-outer {
    color: var(--semi-color-text-2);
    min-height: 60px; }

.semi-table-expand-icon {
  color: var(--semi-color-text-2);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  user-select: none;
  background: transparent;
  position: relative;
  margin-right: 8px; }
  .semi-table-expand-icon-cell {
    display: inline-flex;
    align-items: center;
    justify-content: center; }

.semi-page {
  display: flex;
  list-style: none;
  padding: 0;
  align-items: center;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin-block-start: 0;
  margin-block-end: 0; }
  .semi-page-small {
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400;
    color: var(--semi-color-text-2);
    padding: 0 0; }
  .semi-page-item {
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    min-width: 32px;
    border: 0px solid transparent;
    cursor: pointer;
    user-select: none;
    height: 32px;
    margin-left: 4px;
    margin-right: 4px;
    font-weight: 400;
    color: var(--semi-color-text-0);
    border-radius: var(--semi-border-radius-small);
    text-align: center;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center; }
    .semi-page-item:hover {
      border-color: transparent;
      background-color: var(--semi-color-fill-0);
      color: var(--semi-color-text-0); }
    .semi-page-item-rest-opening {
      background-color: var(--semi-color-fill-0);
      color: var(--semi-color-text-0); }
    .semi-page-item:active {
      border-color: transparent;
      background-color: var(--semi-color-fill-1);
      color: var(--semi-color-text-0); }
    .semi-page-item-active {
      border-color: transparent;
      color: var(--semi-color-primary);
      font-weight: 600;
      background-color: var(--semi-color-primary-light-default); }
      .semi-page-item-active:hover {
        border-color: transparent;
        color: var(--semi-color-primary);
        background-color: var(--semi-color-primary-light-default); }
    .semi-page-item-disabled {
      border-color: transparent;
      color: var(--semi-color-disabled-text);
      background-color: transparent;
      cursor: not-allowed; }
      .semi-page-item-disabled:hover {
        background-color: transparent; }
    .semi-page-item-small {
      min-width: 44px;
      margin: 0; }
  .semi-page-total {
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: var(--semi-color-text-2); }
  .semi-page-prev, .semi-page-next {
    color: var(--semi-color-tertiary);
    cursor: pointer; }
    .semi-page-prev.semi-page-item-disabled, .semi-page-next.semi-page-item-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed; }
  .semi-page-quickjump {
    margin-left: 24px;
    font-size: 12px;
    line-height: 20px;
    font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    color: var(--semi-color-text-0); }
    .semi-page-quickjump-input-number {
      max-width: 50px;
      margin-left: 4px;
      margin-right: 4px; }
    .semi-page-quickjump-disabled {
      color: var(--semi-color-disabled-text); }
  .semi-page .semi-select {
    user-select: none; }

.semi-select-dropdown {
  user-select: none; }

.semi-page-rest-list {
  padding-top: 4px;
  padding-bottom: 4px; }
  .semi-page-rest-list > div {
    position: relative; }

.semi-page-rest-item {
  height: 32px;
  line-height: 32px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer; }
  .semi-page-rest-item:hover {
    background-color: var(--semi-color-fill-0); }
  .semi-page-rest-item:active {
    background-color: var(--semi-color-fill-1); }
`;