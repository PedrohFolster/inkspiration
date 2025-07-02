package inkspiration.backend.util;

public class CpfValidator {
    
    public static boolean isValid(String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            return false;
        }

        // Remove non-numeric characters
        cpf = cpf.replaceAll("[^0-9]", "");
        
        // Check if length is 11
        if (cpf.length() != 11) {
            return false;
        }
        
        // Check if all digits are the same
        if (cpf.matches("(\\d)\\1{10}")) {
            return false;
        }
        
        try {
            int[] numbers = new int[11];
            for (int i = 0; i < 11; i++) {
                numbers[i] = Character.getNumericValue(cpf.charAt(i));
            }

            // Validate first digit
            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += numbers[i] * (10 - i);
            }
            int firstDigit = 11 - (sum % 11);
            if (firstDigit >= 10) {
                firstDigit = 0;
            }
            if (numbers[9] != firstDigit) {
                return false;
            }

            // Validate second digit
            sum = 0;
            for (int i = 0; i < 10; i++) {
                sum += numbers[i] * (11 - i);
            }
            int secondDigit = 11 - (sum % 11);
            if (secondDigit >= 10) {
                secondDigit = 0;
            }
            return numbers[10] == secondDigit;
            
        } catch (NumberFormatException | StringIndexOutOfBoundsException e) {
            return false;
        }
    }
    
    public static String format(String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            return cpf;
        }

        cpf = cpf.replaceAll("[^0-9]", "");
        if (cpf.length() != 11) {
            return cpf;
        }
        return cpf.substring(0, 3) + "." + 
               cpf.substring(3, 6) + "." + 
               cpf.substring(6, 9) + "-" + 
               cpf.substring(9);
    }

    public static String getValidationMessage(String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            return "CPF é obrigatório";
        }
        
        if (!isValid(cpf)) {
            return "CPF inválido";
        }
        
        return null; // Válido
    }
} 