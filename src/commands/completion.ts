import type { Command } from "commander";
import { EXIT_CODES } from "../utils/errors.js";

export function setupCompletionCommand(program: Command): void {
	const cliName = program.name();

	program
		.command("completion")
		.description("Generate shell completion script")
		.argument("<shell>", "Shell type: bash, zsh, fish, powershell")
		.action((shell: string) => {
			const commands = program.commands.filter((c) => c.name() !== "completion").map((c) => c.name());
			const commandList = commands.join(" ");

			switch (shell) {
				case "bash":
					console.log(`# ${cliName} bash completion — add to ~/.bashrc
_${cliName}_completions() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  local commands="${commandList}"
  local global_opts="--help --version --compact --output --page-size --fields --no-color"
  if [ "\${COMP_CWORD}" -eq 1 ]; then
    COMPREPLY=( $(compgen -W "\${commands} \${global_opts}" -- "\${cur}") )
  fi
}
complete -F _${cliName}_completions ${cliName}`);
					break;
				case "zsh":
					console.log(`# ${cliName} zsh completion — add to ~/.zshrc
_${cliName}() {
  local commands=(${commands.map((c) => `"${c}"`).join(" ")})
  local global_opts=(--help --version --compact --output --page-size --fields --no-color)
  _describe 'command' commands
  _describe 'option' global_opts
}
compdef _${cliName} ${cliName}`);
					break;
				case "fish":
					console.log(`# ${cliName} fish completion — save to ~/.config/fish/completions/${cliName}.fish
${commands.map((c) => `complete -c ${cliName} -n "__fish_use_subcommand" -a "${c}" -d "Manage ${c}"`).join("\n")}
complete -c ${cliName} -l help -d "Show help"
complete -c ${cliName} -l version -d "Show version"
complete -c ${cliName} -l compact -d "Compact JSON output"
complete -c ${cliName} -l output -d "Output format" -xa "json table csv"
complete -c ${cliName} -l page-size -d "API page size (1-100)"
complete -c ${cliName} -l fields -d "Comma-separated fields"
complete -c ${cliName} -l no-color -d "Disable colors"`);
					break;
				case "powershell":
					console.log(`# ${cliName} PowerShell completion — add to $PROFILE
Register-ArgumentCompleter -CommandName ${cliName} -ScriptBlock {
  param($commandName, $wordToComplete, $cursorPosition)
  $commands = @(${commands.map((c) => `'${c}'`).join(", ")})
  $globalOpts = @('--help', '--version', '--compact', '--output', '--page-size', '--fields', '--no-color')
  $all = $commands + $globalOpts
  $all | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
  }
}`);
					break;
				default:
					console.error(
						JSON.stringify(
							{
								error: `Unknown shell: ${shell}. Supported: bash, zsh, fish, powershell`,
							},
							null,
							2,
						),
					);
					process.exit(EXIT_CODES.USAGE);
			}
		});
}
