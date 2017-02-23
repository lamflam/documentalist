import tsdoc, { IJsDocTags } from "ts-quick-docs";
import { Documentalist, IBlock } from "..";
import { IPlugin } from "./plugin";

export interface IDocEntry {
    documentation: IBlock;
    fileName: string;
    name: string;
    tags: IJsDocTags;
    type: string;
}

export interface IPropertyEntry extends IDocEntry {
    optional?: boolean;
}

export interface IInterfaceEntry extends IDocEntry {
    extends?: string[];
    properties: IPropertyEntry[];
}

export class TypescriptPlugin implements IPlugin {
    public name = "ts";

    public compile(documentalist: Documentalist, files: string[]) {
        return tsdoc.fromFiles(files, {}).map<IInterfaceEntry>((entry) => ({
            ...entry,
            documentation: documentalist.renderBlock(entry.documentation),
            properties: entry.properties!.map<IPropertyEntry>((prop) => ({
                ...prop,
                documentation: documentalist.renderBlock(prop.documentation),
            })),
        }));
    }
}
