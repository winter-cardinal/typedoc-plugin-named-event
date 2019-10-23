"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const components_1 = require("typedoc/dist/lib/converter/components");
const converter_1 = require("typedoc/dist/lib/converter/converter");
let NamedEventPlugin = class NamedEventPlugin extends components_1.ConverterComponent {
    initialize() {
        this.listenTo(this.owner, {
            [converter_1.Converter.EVENT_BEGIN]: this.onBegin,
            [converter_1.Converter.EVENT_CREATE_DECLARATION]: this.onDeclaration,
            [converter_1.Converter.EVENT_RESOLVE_BEGIN]: this.onBeginResolve,
        });
    }
    onBegin(context) {
        this.targets = [];
    }
    toTag(node) {
        const jsDocs = node.jsDoc;
        for (let i = jsDocs.length - 1; 0 <= i; --i) {
            const jsDoc = jsDocs[i];
            const tags = jsDoc.tags;
            if (tags != null) {
                for (let j = tags.length - 1; 0 <= j; --j) {
                    const tag = tags[j];
                    if (tag.tagName && tag.tagName.text === 'event') {
                        if (tag.comment && 0 < tag.comment.length) {
                            return tag;
                        }
                    }
                }
            }
        }
        return null;
    }
    onDeclaration(context, reflection, node) {
        if (node && node.symbol && node.jsDoc) {
            const tag = this.toTag(node);
            if (tag) {
                this.targets.push({ renameTo: tag.comment, reflection });
            }
        }
    }
    onBeginResolve(context) {
        this.targets.forEach(item => {
            const reflection = item.reflection;
            // Remove @internal
            const signatures = reflection["signatures"];
            if (signatures) {
                for (let i = signatures.length - 1; 0 <= i; --i) {
                    const signature = signatures[i];
                    if (signature.comment) {
                        const tags = signature.comment.tags;
                        if (tags) {
                            for (let j = tags.length - 1; 0 <= j; --j) {
                                if (tags[j].tagName === "internal") {
                                    tags.splice(j, 1);
                                }
                            }
                        }
                    }
                }
            }
            // Rename
            reflection.name = item.renameTo;
            // Remove the optional
            const flags = reflection.flags;
            for (let i = flags.length - 1; 0 <= i; --i) {
                if (flags[i] === "Optional") {
                    flags.splice(i, 1);
                }
            }
        });
    }
};
NamedEventPlugin = __decorate([
    components_1.Component({ name: 'named-event-plugin' })
], NamedEventPlugin);
exports.NamedEventPlugin = NamedEventPlugin;
//# sourceMappingURL=plugin.js.map