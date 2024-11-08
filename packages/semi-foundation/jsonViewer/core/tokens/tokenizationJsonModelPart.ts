/** reference from https://github.com/microsoft/vscode */
import { JSONModel } from '../model/jsonModel';
import { JsonBackgroundTokenizer, JsonTokenizerWithStateStoreAndModel } from './jsonModelToken';
import { Token } from './token';
import { createTokenizationSupport } from './tokenize';
import { IModelContentChangeEvent } from '../common/emitterEvents';
import { emitter } from '../common/emitter';

export interface IBackgroundTokenizationStore {
    setTokens(lineNumber: number, tokens: Token[]): void

    // setEndState(lineNumber: number, state: JSONState): void;

    /**
     * Should be called to indicate that the background tokenization has finished for now.
     * (This triggers bracket pair colorization to re-parse the bracket pairs with token information)
     */
    // backgroundTokenizationFinished(): void;
}

export class TokenizationJsonModelPart {
    private readonly tokens: GrammarTokens;
    private _jsonModel: JSONModel | null = null;
    constructor(jsonModel: JSONModel) {
        this._jsonModel = jsonModel;
        this.tokens = new GrammarTokens(this._jsonModel);
    }

    public getLineTokens(lineNumber: number): Token[] {
        return this.tokens.getLineTokens(lineNumber);
    }

    public handleDidChangeContent(e: IModelContentChangeEvent) {
        this.tokens.handleDidChangeContent(e);
    }

    public forceTokenize(lineNumber: number) {
        this.tokens.forceTokenize(lineNumber);
    }

    public requestTokens(range: { from: number; to: number }) {
        this.tokens.backgroundTokenizer?.requestTokens(range);
    }
}

export class GrammarTokens {
    private _tokens: Map<number, Token[]> = new Map();
    private _tokenizer: JsonTokenizerWithStateStoreAndModel | null = null;
    private _backgroundTokenizer: JsonBackgroundTokenizer | null = null;
    private _jsonModel: JSONModel;
    constructor(jsonModel: JSONModel) {
        this._jsonModel = jsonModel;
        //@ts-ignore
        emitter.on('contentChanged', (e: IModelContentChangeEvent) => {
            this._backgroundTokenizer?.requestTokens({
                from: e.range.startLineNumber,
                to: this._jsonModel.getLineCount(),
            });
            this._backgroundTokenizer?.handleChanges();
        });
        this.resetTokenization();
    }

    public get backgroundTokenizer() {
        return this._backgroundTokenizer;
    }

    public resetTokenization() {
        this._tokens.clear();
        const JsonTokenizationSupport = createTokenizationSupport(true);
        const initialState = JsonTokenizationSupport.getInitialState();
        if (JsonTokenizationSupport && initialState) {
            this._tokenizer = new JsonTokenizerWithStateStoreAndModel(
                this._jsonModel.getLineCount(),
                JsonTokenizationSupport,
                this._jsonModel
            );
        }

        const b: IBackgroundTokenizationStore = {
            setTokens: (lineNumber: number, tokens: Token[]) => {
                this._tokens.set(lineNumber, tokens);
            },
        };
        if (this._tokenizer) {
            this._backgroundTokenizer = new JsonBackgroundTokenizer(this._tokenizer, b);
            this._backgroundTokenizer.handleChanges();
        }
    }
    public getLineTokens(lineNumber: number): Token[] {
        return this._tokens.get(lineNumber) || [];
    }

    public handleDidChangeContent(e: IModelContentChangeEvent) {
        this._backgroundTokenizer?.handleChanges();
    }

    public forceTokenize(lineNumber: number) {
        const b: IBackgroundTokenizationStore = {
            setTokens: (lineNumber: number, tokens: Token[]) => {
                this._tokens.set(lineNumber, tokens);
            },
        };
        this._tokenizer?.updateTokensUntilLine(lineNumber, b);
    }
}
