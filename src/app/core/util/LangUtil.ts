export class LangUtil {
    static compareStrings( a: string, b: string, order: 'desc' | 'asc' = 'asc') {
        if (a.toLowerCase() == b.toLowerCase()) {
            return 0
          } else if (a.toLowerCase() < b.toLowerCase()) {
            return order == 'asc'? -1: 1;
          } else {
            return order == 'asc'? 1: -1;
        }
    }
}