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

my $entries = "";

for my $link (@index) {
    my $addr = "https://analognowhere.com/$link";
    my $resp = get $addr;

    $resp =~ m/img src="(\S+?)"/;
    my $imageAddress = "https://analognowhere.com/$1";

    # title
    my $text;
    $resp =~ m/<h1>(.+?)<\/h1>/;
    $text = lc "$1";

    # subtitle ('*' because might be empty)
    $resp =~ m/<p class="desc">(.*?)<\/p>/;
    $text .= lc $1;

    # description
    for my $p ($resp =~ /<p>([\s\S]+?)<\/p>/g) {
        $text .= lc $p;
    }

    $entries .= "," if $entries ne "";
    $entries .= qq({"entryAddress":"$addr", "imageAddress":"$imageAddress",)
             .  qq("text":") . (sanitize $text) . qq("});
}

my $self_dir = dirname $0;

open(OUT, ">", "$self_dir/script.js") or die "hard";
print OUT "const POSTS = $entries";

print OUT do {
    open(my $in,  "<", "$self_dir/script.js.template") or die "hard";
    local $/;
    <$in>;
};

close OUT;
