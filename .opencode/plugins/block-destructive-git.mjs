const GLOBAL_GIT_OPTIONS_WITH_VALUE = new Set([
  '-C',
  '-c',
  '--git-dir',
  '--work-tree',
  '--namespace',
  '--super-prefix'
]);

function tokenize(command) {
  const tokens = [];
  let current = '';
  let quote = null;

  for (let index = 0; index < command.length; index += 1) {
    const char = command[index];

    if (quote) {
      if (char === quote) {
        quote = null;
      } else if (char === '\\' && quote === '"' && index + 1 < command.length) {
        index += 1;
        current += command[index];
      } else {
        current += char;
      }

      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }

      continue;
    }

    if (char === '\\' && index + 1 < command.length) {
      index += 1;
      current += command[index];
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

function isForceCleanArgument(argument) {
  return argument === '--force' || /^-[A-Za-z]*f[A-Za-z]*$/.test(argument);
}

function hasDotPath(arguments_) {
  return arguments_.some((argument) => argument === '.');
}

function getGitInvocation(tokens, gitIndex) {
  let index = gitIndex + 1;

  while (index < tokens.length) {
    const token = tokens[index];

    if (!token.startsWith('-')) {
      return {
        subcommand: token,
        args: tokens.slice(index + 1)
      };
    }

    if (GLOBAL_GIT_OPTIONS_WITH_VALUE.has(token) || token.startsWith('--git-dir=') || token.startsWith('--work-tree=')) {
      index += token.includes('=') ? 1 : 2;
    } else {
      index += 1;
    }
  }

  return null;
}

function blockedGitCommand(command) {
  const tokens = tokenize(command);

  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index] !== 'git') {
      continue;
    }

    const invocation = getGitInvocation(tokens, index);

    if (!invocation) {
      continue;
    }

    const { args, subcommand } = invocation;

    if (subcommand === 'push') {
      return 'git push is blocked in this project, including --force variants.';
    }

    if (subcommand === 'reset' && args.includes('--hard')) {
      return 'git reset --hard is blocked in this project.';
    }

    if (subcommand === 'clean' && args.some(isForceCleanArgument)) {
      return 'git clean -f / -fd is blocked in this project.';
    }

    if (subcommand === 'branch' && args.includes('-D')) {
      return 'git branch -D is blocked in this project.';
    }

    if ((subcommand === 'checkout' || subcommand === 'restore') && hasDotPath(args)) {
      return `git ${subcommand} . is blocked in this project.`;
    }
  }

  return null;
}

export default async function blockDestructiveGit() {
  return {
    'tool.execute.before': async (input, output) => {
      if (input.tool !== 'bash' || typeof output.args?.command !== 'string') {
        return;
      }

      const reason = blockedGitCommand(output.args.command);

      if (reason) {
        throw new Error(reason);
      }
    }
  };
}
