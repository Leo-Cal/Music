var http = require('http')
var express = require('express');
var request = require('request');
var querystring = require('querystring')
const fs = require('fs').promises;

async function test(){
    var composerCompendium = await fs.readFile('./composers.json');
    const parsedJson = JSON.parse(composerCompendium);
    const composerList = parsedJson.composers;
    const composerNames = composerList.map(composer => composer.name)
    
    const namesTable = document.querySelector('div.composertable')
    const createNamesTable = () => {
        let nameTable = document.createElement('table')
        nameTable.className = 'nameTable'
        let nameTableBody = document.createElement('tbody')
        nameTableBody.className = 'nameTableBody'
        nameTable.append(nameTableBody)
        namesTable.append(nameTable)
    }
}

d = new Date()
d.setSeconds(d.getSeconds() + 79000)
console.log(d.toLocaleString())