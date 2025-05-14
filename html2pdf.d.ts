declare module 'html2pdf.js' {
    function html2pdf(): Html2PdfInstance;
    namespace html2pdf {
        function from(element: HTMLElement | string): Html2PdfInstance;
    }

    interface Html2PdfInstance {
        set(options: any): Html2PdfInstance;
        save(): Promise<void>;
        from(element: HTMLElement | string): Html2PdfInstance;
    }

    export = html2pdf;
  }