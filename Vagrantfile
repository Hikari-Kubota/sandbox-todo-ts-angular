# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", ip: "192.168.33.22"

  config.vm.synced_folder "./", "/vagrant"

  config.vm.provision "shell", :path => "ansible/provision.sh"
end
