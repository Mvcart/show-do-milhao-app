declare module 'crypto-js' {
    export namespace AES {
      function encrypt(message: string, secret: string): any;
      function decrypt(ciphertext: string, secret: string): any;
    }
  
    export namespace enc {
      export namespace Utf8 {
        function parse(value: string): any;
        function stringify(value: any): string;
      }
    }
  }
  