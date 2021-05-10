# Git

## git config

setting user :

```
$ git config  --global user.name "Chun-Yu"
$ git config  --global user.email "doncechenjun@gamil.com"
```

Using --global or --local

```
$ git config --list
```

List all config, also can use cat

```
$ cat ~/.gitconfig  
```




## inital the git

```
$ cd 'porgram dir'
$ git inital
```

Then you can see a .git dir under the program dir

Make a file filename.file under the program dir. Use `git status` to check the Version Control status.

```
$ git status

// On branch master
//
//No commit yet
//
//Untracked files:
//(use "git add <file>..." to include in what will be committed)
//      filename.file
//
//nothing added to commit but untracked files present (use "git add" to track)
```

Git will prompt to use `git add` to tracked filename.file

## Track files

Using `git add` will added file into git staging area(Or cache), wait for submmitted to repository.

```
$ git add filename.file
//
$ git status
// On branch master
//
//No commits yet
//
//Changes to be committed:
//  (use "git rm --cached <file>..." to unstage)
//        new file:   filename.file
```

Prompt : using `git rm --filename.file` to un-tracked file

Using `*` to add multiple file
```
$ git add *.js //add all js files
$ git add . //add all files
$ git add --all // add all files
```

## Saving changes to the repository

```
$ git commit -m "first commit text "
//[master (root-commit) 2a93fdc] first commit text 
//1 file changed, 1 insertion(+)
//create mode ...
```

Using `git log` to get the commit history

```
$ git log
//commit 2a93fdc1a214476af1623096d9a91a0393afebde (HEAD -> master)
//Author: User <email@gmail.com>
//Date:   Sat Jan 11 12:29:53 2020 +0800
```

Text *2a93fdc1a214476af1623096d9a91a0393afebde* is the commit version

Using `cat .git/HEAD` to check the branch

```
$ cat .git/HEAD 
//ref: refs/heads/master
```

master branch in `/master` using cat to browse it 

```
$ cat .git/refs/heads/master
//2a93fdc1a214476af1623096d9a91a0393afebde  
```

Using `git branch` to view the branch

```
$ git branch 
// *master
```

`*` means the HEAD point to this branch

After edit the filename.file:

```
git commit -m "second commit text"
```

Using `git log --online --graph` to view shoter result of `git log`

```
$ git log --oneline --graph
* 4b5d913 (HEAD -< master) second commit  text
* 2a93fdc first commit text
```

Using `git show` to show the different with previous version

only first 4 charater of version sre need

```
$ git show 4b5d
```

## Recovery to previous version

```
git reset --hard __Version__
```

Then filename.file will go back to the `__Version__`

Using `git reflog` to view the change history


## Branch

Branch will inherit all history from the source branch

### Create branch

`git branch [BranchName]`, the HEAD is still point to master

`git checkout -b [BranchName]`, the HEAD will point to this new branch

### Select branch

`git cheackout[BranchName]`

### Delete branch

`git branch -d [BranchName]`, but can't delete the branch which the HEAD point to.

