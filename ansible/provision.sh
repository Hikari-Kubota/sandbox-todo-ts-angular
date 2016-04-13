#!/usr/bin/env bash

if ! [ `which ansible` ]; then
  sudo apt-get update
  sudo apt-get install -y software-properties-common
  sudo add-apt-repository -y ppa:ansible/ansible
  sudo apt-get install -y ansible
fi

sudo cp /vagrant/ansible/inventories/hosts /etc/ansible/hosts -f
sudo chmod 666 /etc/ansible/hosts
ansible-playbook -i /etc/ansible/hosts /vagrant/ansible/playbook.yml
