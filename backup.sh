#!/bin/sh
self_dir=$(dirname "$0")

mkdir -p $self_dir/backup/_/

$self_dir/backup_underscore.pl
