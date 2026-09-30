import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShiftTextService {

  constructor() { }

  
  private readonly CHAR_RANGE = 126 - 32 + 1; // m
  
  private shiftChar(char: string, shift: number): string {    
    const charCode = char.charCodeAt(0);
    const newCharCode = ((charCode - 32 + shift + this.CHAR_RANGE) % this.CHAR_RANGE) + 32;
    return String.fromCharCode(newCharCode);
  }

  shiftText(json: string, shift:number): string {   
    return json.split('').map(char => this.shiftChar(char, shift)).join('');
  }
}
