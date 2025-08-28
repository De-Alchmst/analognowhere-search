#! /usr/bin/env ruby
require 'net/http'
require 'uri'
require 'json'

# Get Index

resp = Net::HTTP.get_response(URI("https://analognowhere.com/_/archive/"))
index = resp.body.scan /_\/[\w\d]+\//

# Get Entries

entries = []

index.each {|link|
  addr = "https://analognowhere.com/" + link
  resp = Net::HTTP.get_response(URI(addr)).body

  entry = {
    "text": "",
    "entryAddress": addr,
    "imageAddress": "",
  }

  entry["imageAddress"] = "https://analognowhere.com/" \
                        + resp.match(/img src="(\S+?)"/)[1]

  # title
  entry["text"] = resp.match(/<h1>(.+?)<\/h1>/)[1]
  # subtitle ('*' because might be empty)
  entry["text"] += resp.match(/<p class="desc">(.*?)<\/p>/)[1]
  # description
  resp.scan(/<p>([\s\S]+?)<\/p/).each {|p|
    # returns each match as list
    entry["text"] += p[0]
  }

  entry["text"].downcase!
  entries << entry
}

self_dir = File.dirname __FILE__

File.write(self_dir + "/script.js", "const POSTS = " \
  + JSON.fast_generate(entries)+ "\n" \
  + File.read(self_dir + "/script.js.template"))
