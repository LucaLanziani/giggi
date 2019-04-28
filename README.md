# giggi

Add workspace concept to git

## Description

Using giggi you can group git repositories in workspaces and run git commands on the latter.

## How to use it

```
npm install -g giggi
```

```
> $ giggi
Usage: giggi [options] [command]

Options:
  -V, --version                                        output the version number
  -h, --help                                           output usage information

Commands:
  workspace-list|wl                                    list workspaces
  workspace-set-default|wsd <workspace>                set default workspace
  workspace-remove|wr                                  remove the workspace
  workspace-status|ws [workspace]                      get status of all repos in the workspace
  workspace-fetch|wf [workspace]                       run fetch on all repos in the workspace
  repo-list|rl [workspace]                             list all repos in a workspace
  repo-add|ra <directory> [workspace] [repoName]       add a repo to a workspace
  repo-remove|rr <repoName> [workspace]                remove a repo from a workspace
  repo-update|ru <repoName> <key> <value> [workspace]  update a property of a repo
  repo-status|rs <repoName> [workspace]                get status of a repo
  repo-fetch|rf <repoName> [workspace]                 run fetch on a repo
```
