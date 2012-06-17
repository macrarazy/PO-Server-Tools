/** core.js **/

PO = new (function () {
              /* Error format utility. */
              this.Error = function (mess, e) {
                       if(typeof mess != "string")
                           mess = "";

                       if(mess != "" && mess[mess.length-1] != "." && mess[mess.length-1] != "!"
                               && mess[mess.length-1] != "?")
                           mess += ".";

                       var lineData = e.lineNumber == 1 ? "" : " on line "+e.lineNumber;
                       var msg = e.message;
                       var type = e.name;

                       var str = type+lineData+": "+msg+".";


                       return mess+" "+str;
                   }

              /** Object utilities. **/

              this.isArray = Array.isArray;
              this.isObject = function (obj) {
                       return typeof obj === "object" && this.isArray(obj) === false;
                   }

              this.isValidJSON = function (json, return_parsed) {
                       try {
                           var parsed = JSON.parse(json), ret_val = [true];
                           if (return_parsed) {
                               ret_val = [true, parsed];
                           }

                           return ret_val;
                       }
                       catch (e) {
                           return false;
                       }
                   }

              /** File utilities. **/
              this.safeStore = function(file, storage) {
                       sys.appendToFile(file, '');
                       var content = sys.getFileContent(file);
                       if(content === '' && storage !== undefined) {
                           sys.appendToFile(file, storage);
                       }
                   }

              this.fileExists = function (file, _path, _nodelete) {
                       var testFile = file;

                       if(typeof _path == 'string') {
                           testFile = this.testPath(testFile) + file;
                       }

                       var tsti = testFile.indexOf, y;

                       this.safeStore(testFile);
                       var content = sys.getFileContent(testFile);

                       if(content == '') {
                           if(!_nodelete) {
                               sys.writeToFile(testFile, "Ready to Delete.");
                               sys.deleteFile(testFile);
                           }
                           return false;
                       }

                       return true;
                   }

              this.content = function (file, _path, _parsejson) {
                       var testFile = file;
                       if (typeof _path == 'string') {
                           testFile = this.testPath(testFile)+file;
                       }

                       var exist = this.fileExists(file, this.iff(_path, false, "string"), true);
                       if (!exist) {
                           return "";
                       }

                       var content = sys.getFileContent(testFile);
                       var isVJSON = this.isValidJSON(content, true)
                       if(isVJSON[0] === true && _parsejson) {
                           return isVJSON[1];
                       }

                       return content;
                   }

              this.testPath = function (path) {
                       if(path !== "" && path[path.length-1] !== "/") {
                           path += "/";
                       }
                       return path;
                   }

              /** String utilities. **/
              this.removeSpaces = function(string, join) {
                       if(!join) {
                           join = "";
                       }

                       return string.split(" ").join(join);
                   }

              this.escapeHtml = function (str) {
                       return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                   }

              this.removeHtml = function (str) {
                       return str.replace(/<\/?[^>]*>/g, "");
                   }


              this.similarity = function (str, comparestr, case_insensitive) {
                       var x, similarity = 0, curstr, curcom;
                       if(str.length === 0 || comparestr.length === 0) {
                           return 0;
                       }

                       for(x in comparestr) {
                           if(typeof str[x] === "undefined" ||
                                   typeof comparestr[x] === "undefined") {
                               break;
                           }
                           curstr = str[x];
                           curcom = comparestr[x];

                           if (case_insensitive) {
                               curcom = curcom.toLowerCase();
                               curstr = curstr.toLowerCase();
                           }

                           if(curstr === curcom) {
                               similarity++;
                           }
                       }

                       return similarity;
                   }

              this.randomColor = function () {
                       var nums = 5;
                       var str = '';

                       while(nums >= 0) {
                           str += sys.rand(0, 16).toString(16);
                           nums--;
                       }

                       return "#"+str;
                   }

              this.randomColour = this.randomColor;

              /* Web utilities. */

              this.webCall = function(url, callback, _POST) {
                       if (url.indexOf("http://") === -1
                               && Number(sys.serverVersion.split(".")[0]) < 2) {
                           return "";
                       }

                       if(callback === undefined) {
                           callback = function (response) {
                                       return response;
                                   }
                       }

                       var callArray = [url, callback];
                       if(this.isObject(_POST)) {
                           callArray.push(_POST);
                       }

                       sys.webCall.apply(null, callArray);
                   }

              this.synchronousWebCall = function(url, _POST) {
                       if (url.indexOf("http://") === -1
                               && Number(sys.serverVersion.split(".")[0]) < 2) {
                           return "";
                       }

                       var callArray = [url];
                       if(this.isObject(_POST)) {
                           callArray.push(_POST);
                       }

                       var resp = sys.synchronousWebCall.apply(null, callArray);

                       return resp;
                   }

              /* Object utilities. */
              this.lengthOf = function (obj) {
                       if(!this.isObject(obj)) {
                           return 0;
                       }

                       return this.values(obj).length;
                   }

              this.values = function(obj) {
                       if(!this.isObject(obj)) {
                           return [];
                       }

                       return Object.keys(obj);
                   }

              /* Array utilities. */
              this.cut = function(array, from, join) {
                       if(!join) {
                           join = "";
                       }

                       return array.splice(from).join(join);
                   }

              this.cut_part = function(array, from, to, join) {
                       if(!join) {
                           join = "";
                       }

                       return array.splice(from, to).join(join);
                   }

              this.push = function(array) {
                       if(!this.isArray(array)) {
                           return;
                       }

                       var pushlist = Array.prototype.slice.call(arguments).slice(0, 1), z;
                       if(pushlist.length > 0) {
                           for(z in pushlist) {
                               array.push(pushlist[z]);
                           }
                       }
                   }

              this.moveSpot = function (array, spots, _changefirstTo) {
                       var x, arl = array.length, cft = typeof _changeFirstTo === "string";
                       if(arl < 1) {
                           return;
                       }

                       for(x in array) {
                           if(x >= spots) {
                               return;
                           }
                           if(cft && x === 0) {
                               array[1] = array[0];
                               array[0] = _changeFirstTo;
                           }
                           else if(cft && x === 1) {
                               continue;
                           }

                           array[x] = array[x+1];
                       }
                   }

              this.shuffleArray = function (array) {
                       if (!this.isArray(array)) {
                           return;
                       }

                       array.sort
                               (function() {
                                    return 0.5 - Math.random();
                                });
                   }

              this.add = function (array, position) {
                       if(!this.isArray(array)) {
                           return array;
                       }

                       var argsToAdd = Array.prototype.slice.call(arguments).slice(0, 1);
                       return array.splice.apply(array, [position, 0].concat(argsToAdd));
                   }

              /* Player utilities. */
              this.auths = function () {
                       var ret = [], names = sys.dbAuths(), y, n;
                       for(y in names) {
                           n = names[y];
                           if(sys.id(n) !== undefined) {
                               ret.push(n);
                           }
                       }
                       return ret;
                   }

              this.sendAuth = function (message, chan) {
                       var auths = this.auths(), y, send = sys.sendAll, msg = message;

                       if (chan === undefined) {
                           send(msg);
                       } else {
                           send(msg, chan);
                       }
                   }

              this.sendAuthHtml = function (message, chan) {
                       var auths = this.auths(), y, send = sys.sendHtmlAll, msg = message;
                       for(y in auths) {
                           if (chan === undefined) {
                               send(msg);
                           } else {
                               send(msg, chan);
                           }
                       }
                   }

              this.idsForIP = function(ip) {
                       var players = sys.playerIds(), y, ipArr = [];
                       for(y in players) {
                           if(sys.ip(players[y]) === ip) {
                               ipArr.push(players[y]);
                           }
                       }
                       return ipArr;
                   }

              this.rangeIP = function (name, _parts) {
                       var parts = 2;

                       if(_parts) {
                           var pIsaN = typeof _parts === 'number', pIsnZ = _parts != 0;
                           if(pIsaN && pIsnZ)
                               parts = this.iffCondition(parts, _parts, _parts, 2, ">");
                       }

                       var ip = sys.dbIp(name);
                       if(ip === undefined) {
                           return this.iifCondition("255.255.", "255.", parts, 2);
                       }
                       var ipParts = ip.split(".");
                       return this.iifCondition(ipParts[0]+"."+ipParts[1]+".", ipParts[0]+".", parts, 2);
                   }

              this.color = function (src) {
                       var myColor = sys.getColor(src);
                       if (myColor === '#000000') {
                           var clist = ['#5811b1','#399bcd','#0474bb','#f8760d','#a00c9e','#0d762b','#5f4c00','#9a4f6d','#d0990f','#1b1390','#028678','#0324b1'];
                           return clist[src % clist.length];
                       }
                       return myColor;
                   }

              this.colour = this.color;

              /* Encoding utilities. */
              this.toUtf8 = function (argString) {
                       if (argString === null || typeof argString === "undefined") {
                           return "";
                       }

                       var string = (argString + '');
                       var utftext = "",
                               start, end, stringl = 0;

                       start = end = 0;
                       stringl = string.length;
                       for (var n = 0; n < stringl; n++) {
                           var c1 = string.charCodeAt(n);
                           var enc = null;

                           if (c1 < 128) {
                               end++;
                           } else if (c1 > 127 && c1 < 2048) {
                               enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
                           } else {
                               enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
                           }
                           if (enc !== null) {
                               if (end > start) {
                                   utftext += string.slice(start, end);
                               }
                               utftext += enc;
                               start = end = n + 1;
                           }
                       }

                       if (end > start) {
                           utftext += string.slice(start, stringl);
                       }

                       return utftext;
                   }

              this.fromUtf8 = function (str_data) {
                       var tmp_arr = [],
                               i = 0,
                               ac = 0,
                               c1 = 0,
                               c2 = 0,
                               c3 = 0;

                       str_data += '';

                       while (i < str_data.length) {
                           c1 = str_data.charCodeAt(i);
                           if (c1 < 128) {
                               tmp_arr[ac++] = String.fromCharCode(c1);
                               i++;
                           } else if (c1 > 191 && c1 < 224) {
                               c2 = str_data.charCodeAt(i + 1);
                               tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                               i += 2;
                           } else {
                               c2 = str_data.charCodeAt(i + 1);
                               c3 = str_data.charCodeAt(i + 2);
                               tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                               i += 3;
                           }
                       }

                       return tmp_arr.join('');
                   }

              this.toBase64 = function (data) {
                       var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                       var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                               ac = 0,
                               enc = "",
                               tmp_arr = [];

                       if (!data) {
                           return data;
                       }

                       data = this.toUtf8(data + '');

                       do {
                           o1 = data.charCodeAt(i++);
                           o2 = data.charCodeAt(i++);
                           o3 = data.charCodeAt(i++);

                           bits = o1 << 16 | o2 << 8 | o3;

                           h1 = bits >> 18 & 0x3f;
                           h2 = bits >> 12 & 0x3f;
                           h3 = bits >> 6 & 0x3f;
                           h4 = bits & 0x3f;

                           tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                       } while (i < data.length);

                       enc = tmp_arr.join('');

                       var r = data.length % 3;

                       return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
                   }

              this.fromBase64 = function (data) {
                       var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                       var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                               ac = 0,
                               dec = "",
                               tmp_arr = [];

                       if (!data) {
                           return data;
                       }

                       data += '';

                       do {
                           h1 = b64.indexOf(data.charAt(i++));
                           h2 = b64.indexOf(data.charAt(i++));
                           h3 = b64.indexOf(data.charAt(i++));
                           h4 = b64.indexOf(data.charAt(i++));

                           bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                           o1 = bits >> 16 & 0xff;
                           o2 = bits >> 8 & 0xff;
                           o3 = bits & 0xff;

                           if (h3 === 64) {
                               tmp_arr[ac++] = String.fromCharCode(o1);
                           }
                           else if (h4 === 64) {
                               tmp_arr[ac++] = String.fromCharCode(o1, o2);
                           }
                           else {
                               tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                           }
                       } while (i < data.length);

                       dec = tmp_arr.join('');
                       dec = this.toUtf8(dec);

                       return dec;
                   }

              this.crc32 = function (str) {
                       str = this.toUtf8(str);
                       var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";

                       var crc = 0;
                       var x = 0;
                       var y = 0;

                       crc = crc ^ (-1);
                       for (var i = 0, iTop = str.length; i < iTop; i++) {
                           y = (crc ^ str.charCodeAt(i)) & 0xFF;
                           x = "0x" + table.substr(y * 9, 8);
                           crc = (crc >>> 8) ^ x;
                       }

                       return crc ^ (-1);
                   }


              this.md5 = function  (str) {
                       if (sys.md5 !== undefined) {
                           return sys.md5(str);
                       }

                       var xl;

                       var rotateLeft = function (lValue, iShiftBits) {
                           return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
                       };

                       var addUnsigned = function (lX, lY) {
                           var lX4, lY4, lX8, lY8, lResult;
                           lX8 = (lX & 0x80000000);
                           lY8 = (lY & 0x80000000);
                           lX4 = (lX & 0x40000000);
                           lY4 = (lY & 0x40000000);
                           lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                           if (lX4 & lY4) {
                               return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                           }
                           if (lX4 | lY4) {
                               if (lResult & 0x40000000) {
                                   return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                               } else {
                                   return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                               }
                           } else {
                               return (lResult ^ lX8 ^ lY8);
                           }
                       };

                       var _F = function (x, y, z) {
                           return (x & y) | ((~x) & z);
                       };
                       var _G = function (x, y, z) {
                           return (x & z) | (y & (~z));
                       };
                       var _H = function (x, y, z) {
                           return (x ^ y ^ z);
                       };
                       var _I = function (x, y, z) {
                           return (y ^ (x | (~z)));
                       };

                       var _FF = function (a, b, c, d, x, s, ac) {
                           a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                           return addUnsigned(rotateLeft(a, s), b);
                       };

                       var _GG = function (a, b, c, d, x, s, ac) {
                           a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                           return addUnsigned(rotateLeft(a, s), b);
                       };

                       var _HH = function (a, b, c, d, x, s, ac) {
                           a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                           return addUnsigned(rotateLeft(a, s), b);
                       };

                       var _II = function (a, b, c, d, x, s, ac) {
                           a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                           return addUnsigned(rotateLeft(a, s), b);
                       };

                       var convertToWordArray = function (str) {
                           var lWordCount;
                           var lMessageLength = str.length;
                           var lNumberOfWords_temp1 = lMessageLength + 8;
                           var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                           var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                           var lWordArray = new Array(lNumberOfWords - 1);
                           var lBytePosition = 0;
                           var lByteCount = 0;
                           while (lByteCount < lMessageLength) {
                               lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                               lBytePosition = (lByteCount % 4) * 8;
                               lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                               lByteCount++;
                           }
                           lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                           lBytePosition = (lByteCount % 4) * 8;
                           lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                           lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                           lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                           return lWordArray;
                       };

                       var wordToHex = function (lValue) {
                           var wordToHexValue = "",
                                   wordToHexValue_temp = "",
                                   lByte, lCount;
                           for (lCount = 0; lCount <= 3; lCount++) {
                               lByte = (lValue >>> (lCount * 8)) & 255;
                               wordToHexValue_temp = "0" + lByte.toString(16);
                               wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                           }
                           return wordToHexValue;
                       };

                       var x = [],
                               k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                               S12 = 12,
                               S13 = 17,
                               S14 = 22,
                               S21 = 5,
                               S22 = 9,
                               S23 = 14,
                               S24 = 20,
                               S31 = 4,
                               S32 = 11,
                               S33 = 16,
                               S34 = 23,
                               S41 = 6,
                               S42 = 10,
                               S43 = 15,
                               S44 = 21;

                       str = this.toUtf8(str);
                       x = convertToWordArray(str);
                       a = 0x67452301;
                       b = 0xEFCDAB89;
                       c = 0x98BADCFE;
                       d = 0x10325476;

                       xl = x.length;
                       for (k = 0; k < xl; k += 16) {
                           AA = a;
                           BB = b;
                           CC = c;
                           DD = d;
                           a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                           d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                           c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                           b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                           a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                           d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                           c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                           b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                           a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                           d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                           c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                           b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                           a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                           d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                           c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                           b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                           a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                           d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                           c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                           b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                           a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                           d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                           c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                           b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                           a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                           d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                           c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                           b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                           a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                           d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                           c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                           b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                           a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                           d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                           c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                           b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                           a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                           d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                           c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                           b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                           a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                           d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                           c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                           b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                           a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                           d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                           c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                           b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                           a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                           d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                           c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                           b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                           a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                           d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                           c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                           b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                           a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                           d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                           c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                           b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                           a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                           d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                           c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                           b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                           a = addUnsigned(a, AA);
                           b = addUnsigned(b, BB);
                           c = addUnsigned(c, CC);
                           d = addUnsigned(d, DD);
                       }

                       var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

                       return temp.toLowerCase();
                   }

              this.sha1 = function (str) {
                       if (sys.sha1 !== undefined) {
                           return sys.sha1(str);
                       }

                       var rotate_left = function (n, s) {
                           var t4 = (n << s) | (n >>> (32 - s));
                           return t4;
                       };

                       var cvt_hex = function (val) {
                           var str = "";
                           var i;
                           var v;

                           for (i = 7; i >= 0; i--) {
                               v = (val >>> (i * 4)) & 0x0f;
                               str += v.toString(16);
                           }
                           return str;
                       };

                       var blockstart;
                       var i, j;
                       var W = new Array(80);
                       var H0 = 0x67452301;
                       var H1 = 0xEFCDAB89;
                       var H2 = 0x98BADCFE;
                       var H3 = 0x10325476;
                       var H4 = 0xC3D2E1F0;
                       var A, B, C, D, E;
                       var temp;

                       str = this.utf8_encode(str);
                       var str_len = str.length;

                       var word_array = [];
                       for (i = 0; i < str_len - 3; i += 4) {
                           j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
                           word_array.push(j);
                       }

                       switch (str_len % 4) {
                       case 0:
                           i = 0x080000000;
                           break;
                       case 1:
                           i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
                           break;
                       case 2:
                           i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
                           break;
                       case 3:
                           i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
                           break;
                       }

                       word_array.push(i);

                       while ((word_array.length % 16) != 14) {
                           word_array.push(0);
                       }

                       word_array.push(str_len >>> 29);
                       word_array.push((str_len << 3) & 0x0ffffffff);

                       for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
                           for (i = 0; i < 16; i++) {
                               W[i] = word_array[blockstart + i];
                           }
                           for (i = 16; i <= 79; i++) {
                               W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
                           }


                           A = H0;
                           B = H1;
                           C = H2;
                           D = H3;
                           E = H4;

                           for (i = 0; i <= 19; i++) {
                               temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                               E = D;
                               D = C;
                               C = rotate_left(B, 30);
                               B = A;
                               A = temp;
                           }

                           for (i = 20; i <= 39; i++) {
                               temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                               E = D;
                               D = C;
                               C = rotate_left(B, 30);
                               B = A;
                               A = temp;
                           }

                           for (i = 40; i <= 59; i++) {
                               temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                               E = D;
                               D = C;
                               C = rotate_left(B, 30);
                               B = A;
                               A = temp;
                           }

                           for (i = 60; i <= 79; i++) {
                               temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                               E = D;
                               D = C;
                               C = rotate_left(B, 30);
                               B = A;
                               A = temp;
                           }

                           H0 = (H0 + A) & 0x0ffffffff;
                           H1 = (H1 + B) & 0x0ffffffff;
                           H2 = (H2 + C) & 0x0ffffffff;
                           H3 = (H3 + D) & 0x0ffffffff;
                           H4 = (H4 + E) & 0x0ffffffff;
                       }

                       temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
                       return temp.toLowerCase();
                   }

              this.seed = function (prefix) {
                       if (typeof prefix === 'undefined') {
                           prefix = "";
                       }

                       var retId;
                       var formatSeed = function (seed, reqWidth) {
                           seed = parseInt(seed, 10).toString(16);
                           if (reqWidth < seed.length) {
                               return seed.slice(seed.length - reqWidth);
                           }
                           if (reqWidth > seed.length) {
                               return Array(1 + (reqWidth - seed.length)).join('0') + seed;
                           }
                           return seed;
                       };

                       if (!this.uniqidSeed) {
                           this.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
                       }
                       this.uniqidSeed++;

                       retId = prefix;
                       retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
                       retId += formatSeed(this.uniqidSeed, 5);

                       return retId;
                   }

              /* Other utilities. */
              this.iif = function(if1, if2, c) {
                       if(typeof if1 == "undefined" || typeof if2 === "undefined") {
                           return if1;
                       }

                       c = String(c).toLowerCase();
                       if(c !== "string" && c !== "number" && c !== "object" && c !== "boolean" && c !== "function") {
                           c = "undefined";
                       }

                       return typeof if1 === c ? if1 : if2;
                   }

              this.iifCondition = function(if1, if2, c, cval, _operator) {
                       if(typeof if1 == "undefined" || typeof if2 === "undefined") {
                           return if1;
                       }

                       var o = _operator;
                       if(o !== ">" && o !== ">=" && o !== "===" && o !== "==" && o !== "<" && o !== "<=") {
                           o = "==";
                       }

                       var evas;
                       cval = c === "typeof" ? "\""+cval+"\"" : cval;
                       eval("evas = "+c+" "+if1+" "+o+" "+cval+" ? "+if1+" : "+if2+";");
                       return evas;
                   }

              this.serverConfig = function () {
                       var hash = {};
                       var file = "config";
                       var cnt = sys.getFileContent(file);
                       var da = "";
                       var y, c = cnt.split("\n"), s;

                       for(y in c) {
                           if(c[y] == "[General]")
                               continue;
                           s = c[y].split("=");
                           s[1] = s[1].replace(/\\xe9/i,"é"); // Pokémon fix.

                           if(da != "") {
                               if(!s[0] == "server_maxplayers" || !s[0] === "mainchanname") {
                                   hash[dan] += s[1];
                               }
                               else {
                                   da = "";
                               }
                           }

                           if(s[0] === "server_description" || s[0] === "server_announcement") {
                               da = s[0];
                               hash[s[0]] = s[1];
                           }

                           hash[s[0]] = s[1];
                       }

                       return hash;
                   }

              this.type_of = function (arg) {
                       var type = typeof arg;
                       if(type == "object") {
                           if(type === null) {
                               type = "null";
                           }
                           else if(this.isObject(arg)) {
                               type = "object";
                           }
                           else if(this.isArray(arg)) {
                               type = "array";
                           }
                           else {
                               type = "undefined";
                           }
                       }

                       return type;
                   }

          })();
