/*
 * Copyright notice
 *
 * v0.1 (c) 2010 Tim de Koning - Kingsquare Information Services.  All rights reserved.
 *
 * Original version fc64 by Darron Schall and Claus Wahlers
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

jQuery.fn.extend({
	jsc64: function(keyboardEventListener) {
		//only load required classes once...
		if ( typeof nl.kingsquare == 'undefined' ) {
			alert('Please load jquery.jsc64classes.js before using this plugin');
		}

		return this.each(function() {
			var jsc64Instance = {}, binFileReader;

			//initialise evenlistener for this instance
			if ( typeof keyboardEventListener == 'undefined' ) {
				keyboardEventListener = $(document);
			}


			
// Array per memorizzare i dati dei file
let cachedKernal = null;
let cachedBasic = null;
let cachedChars = null;

// Funzione per caricare i dati con fallback alla cache
function loadFileData(filePath, cachedDataArray) {
    // Se i dati sono già stati memorizzati, utilizzali
    if (cachedDataArray) {
        console.log(`Using cached data for ${filePath}`);
        return cachedDataArray;
    }

    // Altrimenti, carica i dati dal file e memorizzali
    const binFileReader = new BinFileReader(filePath);
    const result = binFileReader.readString(binFileReader.getFileSize());
    console.log(`Loaded data from ${filePath}`);
    return result;
}

// Carica e memorizza il contenuto del file KERNAL
//cachedKernal = loadFileData(JSC64_BASEPATH + 'assets/kernal.901227-03.bin', cachedKernal);
			
/*
	console.log("kernal=",cachedKernal.length);
	cachedKernalArr = arrayFromBinary(cachedKernal);
	console.log("kernalArr=",cachedKernalArr);
	cachedKernalBin =  binaryFromArray(cachedKernalArr);
	console.log("kernal2=", (cachedKernalBin === cachedKernal));
*/
			
cachedKernalBinFromFile = binaryFromArray(cachedKernalArrayFromFile);
//console.log("kernal3=", (cachedKernalBinFromFile === cachedKernal));			
jsc64Instance.romKernel = nl.kingsquare.as3.flash.utils.getByteArray(cachedKernalBinFromFile);
console.log("KERNAL LOADED");

// Carica e memorizza il contenuto del file BASIC
//cachedBasic = loadFileData(JSC64_BASEPATH + 'assets/basic.901226-01.bin', cachedBasic);
			
/*
	console.log("basic=",cachedBasic.length);
	cachedBasicArr = arrayFromBinary(cachedBasic);
	console.log("cachedBasicArr=",cachedBasicArr);
	cachedBasicBin =  binaryFromArray(cachedBasicArr);
	console.log("basic2=", (cachedBasicBin === cachedBasic));
*/
			
cachedBasicBinFromFile = binaryFromArray(cachedBasicArrayFromFile);
//console.log("basic3=", (cachedBasicBinFromFile === cachedBasic));			
jsc64Instance.romBasic = nl.kingsquare.as3.flash.utils.getByteArray(cachedBasicBinFromFile);
console.log("BASIC LOADED");
			
// Carica e memorizza il contenuto del file CHARS
//cachedChars = loadFileData(JSC64_BASEPATH + 'assets/characters.901225-01.bin', cachedChars);
			
/*
	console.log("chars=",cachedChars.length);
	cachedCharsArr = arrayFromBinary(cachedChars);
	console.log("cachedCharscArr=",cachedCharsArr);
	cachedCharsBin =  binaryFromArray(cachedCharsArr);
	console.log("chars2=", (cachedCharsBin === cachedChars));
*/
			
cachedCharsBinFromFile = binaryFromArray(cachedCharsArrayFromFile);
//console.log("chars3=", (cachedCharsBinFromFile === cachedChars));
jsc64Instance.romChar = nl.kingsquare.as3.flash.utils.getByteArray(cachedCharsBinFromFile);
console.log("CHARS LOADED");




function arrayFromBinary(data) {
    // Convertiamo il testo binario in un array di numeri, dove ogni numero rappresenta un byte
    return  Array.from(data, char => char.charCodeAt(0) & 0xFF);
}

function binaryFromArray(array) {
    // Convertiamo il testo binario in un array di numeri, dove ogni numero rappresenta un byte
     return array.map(byte => String.fromCharCode(byte)).join('');
}
						
			
			//initialze memorybanks and memory manager
			jsc64Instance._mem = new nl.kingsquare.c64.memory.MemoryManager();
			jsc64Instance._mem.setMemoryBank(nl.kingsquare.c64.memory.MemoryManager.MEMBANK_KERNAL, 0xe000, jsc64Instance.romKernel.length, jsc64Instance.romKernel);
			jsc64Instance._mem.setMemoryBank(nl.kingsquare.c64.memory.MemoryManager.MEMBANK_BASIC, 0xa000, jsc64Instance.romBasic.length, jsc64Instance.romBasic);
			jsc64Instance._mem.setMemoryBank(nl.kingsquare.c64.memory.MemoryManager.MEMBANK_CHARACTER, 0xd000, jsc64Instance.romChar.length, jsc64Instance.romChar);

			// create cpu
			jsc64Instance._cpu = new nl.kingsquare.core.cpu.CPU6502(jsc64Instance._mem);

			/* $A483 is the main Basic program loop
			// breakpoints are disabled for now to squeeze out most JavaScript performance, breakpoint can be enabled by setting nl.kingsquare.debug to true.
			jsc64Instance._cpu.setBreakpoint(0xA483, 255);
			*/
			jsc64Instance._renderer = new nl.kingsquare.c64.screen.Renderer(jsc64Instance, $(this));

			/*
			unnessecary events are ignored for now, for extra performance
			jsc64Instance._renderer.addEventListener("frameRateInfoInternal", onFrameRateInfo);*/
			/*jsc64Instance._renderer.addEventListener("stopInternal", onStop);*/

			// Initialize and enable keyboard
			jsc64Instance._mem.cia1.keyboard.initialize(jsc64Instance._cpu, keyboardEventListener);
			jsc64Instance._mem.cia1.keyboard.setEnabled(true);

			// Store a reference to the instance information
			$(this).data('c64', jsc64Instance);

			// Start renderer
			jsc64Instance._renderer.start();
		});
	},
	jsc64Pause: function() {
		var jsc64Instance =  $(this).data('c64');
		jsc64Instance._renderer.frameTimer.running = !jsc64Instance._renderer.frameTimer.running;
	},
	loadPrg: function(url) {
console.log("Altro loadPrg", url);		
    	var binFileReader = new BinFileReader(url), ba = nl.kingsquare.as3.flash.utils.getByteArray(binFileReader.readString(binFileReader.getFileSize())),
console.log("loadPrg - binFileReader", url);		
        startAddress = 0, addr = 0, jsc64Instance =  $(this).data('c64');
console.log("loadPrg - jsc64Instance", jsc64Instance);		

		// get start address
		ba.endian = Endian.LITTLE_ENDIAN;
		startAddress = ba.readShort();

		// copy contents
		addr = startAddress;
		for(var i = 0x02; i < ba.length; i++) {
			jsc64Instance._mem.write(addr++, ba[i]);
		}
		if(startAddress == 0x0801) {
			// run command
			var charsInBuffer = jsc64Instance._mem.read(0xc6);
			if(charsInBuffer < jsc64Instance._mem.read(0x0289) - 4) {
				var keyboardBuffer = 0x0277 + charsInBuffer + 1;
				jsc64Instance._mem.write(keyboardBuffer++, 82); // R
				jsc64Instance._mem.write(keyboardBuffer++, 85); // U
				jsc64Instance._mem.write(keyboardBuffer++, 78); // N
				jsc64Instance._mem.write(keyboardBuffer++, 13); // Return
				jsc64Instance._mem.write(0xc6, charsInBuffer + 5);
			}
		} else {
			jsc64Instance._cpu.pc = startAddress;
		}
	},
	jsc64GetInstance: function() {
	 	return $(this).data('c64');
	}
});
