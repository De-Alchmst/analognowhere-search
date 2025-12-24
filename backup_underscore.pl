#!/usr/bin/env perl

use strict;
use warnings;
use open ":std", ":encoding(UTF-8)";

use LWP::Simple;
use File::Basename;

# Prepare text for JSON
sub sanitize {
    my $txt = shift;
    $txt =~ s/\\/\\\\/g;
    $txt =~ s/"/\\"/g;
    $txt =~ s/\n/\\n/g;
    return $txt;
}

# Get Index

my $resp = get "https://analognowhere.com/_/archive/";
my @index = $resp =~ /_\/[\w\d]+\//g;

# Get Entries

my $self_dir = dirname $0;
my $entries = "";

for my $link (@index) {
    my ($addr, $image_address, $text);

    my $local_path = "$self_dir/backup/$link";

    # data not present, download them and store locally
    if (not -e $local_path) {
        ## download
        $addr = "https://analognowhere.com/$link";
        my $resp = get $addr;

        $resp =~ m/img src="(\S+?)"/;
        my $server_image_address = "https://analognowhere.com/$1";
        my ($image_extention) = $server_image_address =~ m/(\.\w+)$/;
        $image_address = "backup/${link}image$image_extention";

        # title
        $resp =~ m/<h1>(.+?)<\/h1>/;
        $text = lc $1;

        # subtitle ('*' because might be empty)
        $resp =~ m/<p class="desc">(.*?)<\/p>/;
        $text .= " " . lc $1;

        # description
        for my $p ($resp =~ /<p>([\s\S]+?)<\/p>/g) {
            $text .= " " . lc $p;
        }

        ## store data
        mkdir $local_path;

        # store image
        getstore($server_image_address, "$local_path/image$image_extention");

        # store data
        open(DATA_OUT, ">", "$local_path/data.txt") or die "hard";
        print DATA_OUT "$addr\n$image_address\n$text";
        close DATA_OUT;
    }

    # data present, read local version
    else {
        open(DATA_IN, "<", "$local_path/data.txt") or die "hard";
        chomp($addr          = <DATA_IN>);
        chomp($image_address = <DATA_IN>);
        {
            local $/;
            $text = <DATA_IN>;
        }
        close DATA_IN;
    }


    $entries .= "," if $entries ne "";
    $entries .= qq({"entryAddress":"$addr", "imageAddress":"$image_address",)
             .  qq("text":") . (sanitize $text) . qq("});
}


open(SCRIPT_OUT, ">", "$self_dir/script.js") or die "hard";
print SCRIPT_OUT "const POSTS = [$entries];";

print SCRIPT_OUT do {
    open(my $in,  "<", "$self_dir/script.js.template") or die "hard";
    local $/;
    <$in>;
};

close SCRIPT_OUT;
