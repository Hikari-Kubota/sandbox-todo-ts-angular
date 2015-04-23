# sandbox-todo-ts-angular

my sandbox.

## Installation

[Vagrant](https://www.vagrantup.com/) と [VirtualBox](https://www.virtualbox.org/) をインストールして、`Vagrantfile` があるディレクトリで以下のコマンドを叩く:
```shell
$ vagrant up
```

起動したら仮想マシンに接続して色々インストール:
```shell
$ vagrant ssh
$ cd /vagrant
$ npm install
```

## Usage

詳しくは package.json がある階層で `npm run` を参照。

### Build
```shell
$ npm run build
```

### Watch
```shell
$ npm run watch
```
