import { Component, ConverterComponent } from 'typedoc/dist/lib/converter/components';
import { Converter } from 'typedoc/dist/lib/converter/converter';
import { Reflection } from 'typedoc/dist/lib/models/reflections/abstract';
import { Context } from 'typedoc/dist/lib/converter/context';

interface TargetDeclaration {
	renameTo: string;
	reflection: Reflection;
}

@Component({ name: 'named-event-plugin' })
export class NamedEventPlugin extends ConverterComponent {
	private targets: TargetDeclaration[];

	initialize() {
		this.listenTo(this.owner, {
			[Converter.EVENT_BEGIN]: this.onBegin,
			[Converter.EVENT_CREATE_DECLARATION]: this.onDeclaration,
			[Converter.EVENT_RESOLVE_BEGIN]: this.onBeginResolve,
		});
	}

	private onBegin(context: Context) {
		this.targets = [];
	}

	private toTag( node ){
		const jsDocs = node.jsDoc;
		for( let i=jsDocs.length-1; 0<=i; --i ) {
			const jsDoc = jsDocs[ i ];
			const tags = jsDoc.tags;
			if( tags != null ) {
				for( let j=tags.length-1; 0<=j; --j ) {
					const tag = tags[ j ];
					if( tag.tagName && tag.tagName.text === 'event' ) {
						if( tag.comment && 0 < tag.comment.length ) {
							return tag;
						}
					}
				}
			}
		}
		return null;
	}

	private onDeclaration(context: Context, reflection: Reflection, node?) {
        if( node && node.symbol && node.jsDoc ) {
			const tag = this.toTag( node );
			if( tag ) {
				this.targets.push({ renameTo: tag.comment, reflection });
			}
        }
	}

	private onBeginResolve(context: Context) {
		this.targets.forEach(item => {
			const reflection = item.reflection;

			// Remove @internal
			const signatures = reflection[ "signatures" ];
			if( signatures ) {
				for( let i=signatures.length-1; 0<=i; --i ) {
					const signature = signatures[ i ];
					if( signature.comment ) {
						const tags = signature.comment.tags;
						if( tags ) {
							for( let j=tags.length-1; 0<=j; --j ) {
								if( tags[ j ].tagName === "internal" ) {
									tags.splice( j, 1 );
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
			for( let i=flags.length-1; 0<=i; --i ) {
				if( flags[ i ] === "Optional" ) {
					flags.splice( i, 1 );
				}
			}
		});
	}
}
