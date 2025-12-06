const Gif = new Proxy({"src":"/_astro/forms.CI1E9QQ9.gif","width":800,"height":600,"format":"gif"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/images/forms.gif";
							}
							
							return target[name];
						}
					});

export { Gif as G };
