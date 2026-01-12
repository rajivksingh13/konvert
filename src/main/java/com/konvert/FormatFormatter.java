package com.konvert;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import com.konvert.util.ToonUtil;
import org.yaml.snakeyaml.Yaml;

public class FormatFormatter {
    
    private static final ObjectMapper jsonMapper = new ObjectMapper();
    private static final YAMLMapper yamlMapper = new YAMLMapper();
    private static final Yaml yaml = new Yaml();
    
    public static String formatJson(String jsonString) throws Exception {
        Object obj = jsonMapper.readValue(jsonString, Object.class);
        return jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
    }
    
    public static String formatYaml(String yamlString) throws Exception {
        Object obj = yaml.load(yamlString);
        return yamlMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
    }
    
    public static String formatToon(String toonString, String delimiter) throws Exception {
        return ToonUtil.formatToon(toonString, delimiter);
    }
}

